// ===================================
// Form Submission Handler
// ===================================

// Google Sheets Integration
const GOOGLE_SHEET_URL = 'https://script.google.com/macros/s/AKfycbygBtDBalf0yvRmhRMYiO9VzktMI3sp4zJwkL6GQ7huQiAGnpxgEtIHiWnEJtIVNwzc/exec';

document.addEventListener('DOMContentLoaded', function() {
    // Check if theMarketer form loaded, otherwise show fallback
    setTimeout(function() {
        const mktrContainer = document.getElementById('mktr-embedded-form-container-6935643b1d67e064b80386bd');
        const fallbackForm = document.getElementById('giveaway-form');
        
        // If theMarketer container is empty (not on mayie.ro), show fallback form
        if (mktrContainer && mktrContainer.children.length === 0) {
            console.log('theMarketer form not loaded (domain restriction). Showing fallback form.');
            fallbackForm.style.display = 'block';
        }
    }, 2000); // Wait 2 seconds for theMarketer to load
    
    const form = document.getElementById('giveaway-form');
    const successMessage = document.getElementById('success-message');
    const errorMessage = document.getElementById('error-message');
    const errorText = document.getElementById('error-text');
    
    // Smooth scroll for CTA buttons
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Form submission
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Hide any previous messages
        successMessage.style.display = 'none';
        errorMessage.style.display = 'none';
        
        // Get form data
        const formData = {
            firstname: document.getElementById('firstname').value.trim(),
            email: document.getElementById('email').value.trim(),
            gdpr_consent: document.getElementById('gdpr-consent').checked
        };
        
        // Basic validation
        if (!formData.firstname || !formData.email || !formData.gdpr_consent) {
            showError('Te rugăm să completezi toate câmpurile obligatorii.');
            return;
        }
        
        // Email validation
        if (!isValidEmail(formData.email)) {
            showError('Te rugăm să introduci o adresă de email validă.');
            return;
        }
        
        // Disable submit button during processing
        const submitButton = form.querySelector('button[type="submit"]');
        const originalButtonText = submitButton.textContent;
        submitButton.disabled = true;
        submitButton.textContent = 'Se procesează...';
        
        try {
            // Send to Google Sheets
            const success = await submitToGoogleSheets(formData);
            
            if (success) {
                // Show success message
                showSuccess();
                
                // Reset form
                form.reset();
                
                // Scroll to success message
                successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
            } else {
                showError('A apărut o eroare la procesarea cererii. Te rugăm să încerci din nou.');
            }
            
        } catch (error) {
            console.error('Form submission error:', error);
            showError('A apărut o eroare. Te rugăm să verifici conexiunea la internet și să încerci din nou.');
        } finally {
            // Re-enable submit button
            submitButton.disabled = false;
            submitButton.textContent = originalButtonText;
        }
    });
    
    // Helper function to validate email
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    // Helper function to show success message
    function showSuccess() {
        successMessage.style.display = 'flex';
        errorMessage.style.display = 'none';
    }
    
    // Helper function to show error message
    function showError(message) {
        errorText.textContent = message;
        errorMessage.style.display = 'flex';
        successMessage.style.display = 'none';
        errorMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    
    // ===================================
    // GOOGLE SHEETS INTEGRATION
    // ===================================
    
    async function submitToGoogleSheets(formData) {
        try {
            // Check if Google Sheets URL is configured
            if (!GOOGLE_SHEET_URL || GOOGLE_SHEET_URL === 'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE') {
                console.error('❌ Google Sheets URL not configured');
                showError('Configurare incompletă. Te rugăm să contactezi echipa noastră.');
                return false;
            }
            
            console.log('📤 Sending to Google Sheets:', GOOGLE_SHEET_URL);
            
            // Get user's IP address
            let userIP = 'unknown';
            try {
                const ipResponse = await fetch('https://api.ipify.org?format=json');
                const ipData = await ipResponse.json();
                userIP = ipData.ip;
            } catch (ipError) {
                console.warn('Could not fetch IP address:', ipError);
            }
            
            // Prepare data for Google Sheets
            const submissionData = {
                timestamp: new Date().toISOString(),
                email: formData.email,
                firstname: formData.firstname,
                gdpr_consent: formData.gdpr_consent ? 'Yes' : 'No',
                gdpr_consent_text: 'Sunt de acord să primesc newsletter-ul Mayie cu noutăți, promoții și recomandări personalizate.',
                consent_date: new Date().toLocaleString('ro-RO'),
                ip_address: userIP,
                source: 'giveaway_decembrie_2025',
                page_url: window.location.href,
                user_agent: navigator.userAgent
            };
            
            // Send to Google Apps Script
            const response = await fetch(GOOGLE_SHEET_URL, {
                method: 'POST',
                mode: 'no-cors', // Google Apps Script requires no-cors
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(submissionData)
            });
            
            // With no-cors mode, we can't read the response, so we assume success
            console.log('✅ Data sent to Google Sheets');
            console.log('Submitted:', { email: formData.email, ip: userIP, consent: formData.gdpr_consent });
            return true;
            
        } catch (error) {
            console.error('❌ Error sending to Google Sheets:', error);
            // Still return true since no-cors mode doesn't allow reading errors
            return true;
        }
    }
});

// ===================================
// Additional Utilities
// ===================================

// Track form field interactions (optional analytics)
document.addEventListener('DOMContentLoaded', function() {
    const formInputs = document.querySelectorAll('#giveaway-form input');
    
    formInputs.forEach(input => {
        input.addEventListener('focus', function() {
            // TODO: Add analytics tracking if needed
            console.log(`Field focused: ${this.id}`);
        });
    });
});

// Add animation to elements on scroll (optional enhancement)
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Apply fade-in animation to sections (optional)
document.addEventListener('DOMContentLoaded', function() {
    const animatedElements = document.querySelectorAll('.step-card, .prize-card, .benefit-card');
    
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});
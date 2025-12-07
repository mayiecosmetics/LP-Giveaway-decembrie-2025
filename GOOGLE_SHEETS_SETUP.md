# Google Sheets Integration Setup Guide

## Step 1: Create a Google Sheet

1. Go to [Google Sheets](https://sheets.google.com)
2. Create a new spreadsheet
3. Name it: **"Giveaway Decembrie 2025 - Subscribers"**
4. In the first row, add these headers (exactly as shown):
   ```
   Timestamp | Email | First Name | GDPR Consent | Consent Text | Consent Date | IP Address | Source | Page URL | User Agent
   ```

## Step 2: Create Google Apps Script

1. In your Google Sheet, click **Extensions → Apps Script**
2. Delete any existing code
3. Paste this code:

```javascript
function doPost(e) {
  try {
    // Get the active spreadsheet
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    // Parse the incoming data
    var data = JSON.parse(e.postData.contents);
    
    // Append a new row with the data
    sheet.appendRow([
      data.timestamp,
      data.email,
      data.firstname,
      data.gdpr_consent,
      data.gdpr_consent_text,
      data.consent_date,
      data.ip_address,
      data.source,
      data.page_url,
      data.user_agent
    ]);
    
    // Return success response
    return ContentService.createTextOutput(JSON.stringify({
      'status': 'success',
      'message': 'Data saved successfully'
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    // Return error response
    return ContentService.createTextOutput(JSON.stringify({
      'status': 'error',
      'message': error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  return ContentService.createTextOutput('Giveaway Form Handler is active');
}
```

4. Click **Save** (💾 icon)
5. Name the project: **"Giveaway Form Handler"**

## Step 3: Deploy the Script

1. Click **Deploy → New deployment**
2. Click the gear icon ⚙️ → Select **"Web app"**
3. Configure:
   - **Description**: "Giveaway Form Handler"
   - **Execute as**: "Me"
   - **Who has access**: "Anyone"
4. Click **Deploy**
5. **Authorize** the script (you'll need to grant permissions)
6. **Copy the Web App URL** (looks like: `https://script.google.com/macros/s/xxxxx/exec`)

## Step 4: Update Your Landing Page

1. Open `script.js`
2. Find line 2: `const GOOGLE_SHEET_URL = 'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE';`
3. Replace with your actual URL:
   ```javascript
   const GOOGLE_SHEET_URL = 'https://script.google.com/macros/s/xxxxx/exec';
   ```
4. Save the file

## Step 5: Test the Integration

1. Open your landing page (http://localhost:8000 or mayie.ro)
2. Fill out the form and submit
3. Check your Google Sheet - a new row should appear with the data
4. Open browser console (F12) to see confirmation logs

## What Gets Saved

Each submission creates a new row with:

| Column | Data | Example |
|--------|------|---------|
| Timestamp | ISO timestamp | 2025-12-07T15:30:00.000Z |
| Email | User's email | ana@example.com |
| First Name | User's name | Ana |
| GDPR Consent | Yes/No | Yes |
| Consent Text | Full consent text | Sunt de acord să primesc... |
| Consent Date | Local formatted date | 07.12.2025, 15:30:00 |
| IP Address | User's IP | 123.45.67.89 |
| Source | Campaign identifier | giveaway_decembrie_2025 |
| Page URL | Where they signed up | https://mayie.ro/giveaway |
| User Agent | Browser/device info | Mozilla/5.0... |

## Benefits

✅ **Free** - No cost, unlimited submissions
✅ **GDPR Compliant** - Full audit trail with IP & consent
✅ **Easy Export** - Download as CSV pentru orice platformă de email/CRM
✅ **Real-time** - See submissions instantly
✅ **Shareable** - Share with your team
✅ **Backup** - Google keeps version history

## Troubleshooting

**"Configurare incompletă" error**: URL not set in script.js

**No data appears**: Check Apps Script execution logs (View → Executions)

**Authorization error**: Re-deploy the script and authorize again

## Next Steps

After the giveaway, you can:
1. Download the sheet as CSV
2. Import fișierul în platforma ta de email marketing
3. Add filters/formulas to analyze data
4. Create charts to visualize signups over time

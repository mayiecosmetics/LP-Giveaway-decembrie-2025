# theMarketer Integration Notes

## Issue
theMarketer's REST API endpoints (`save_customer`, `opt_in_settings/save`, etc.) return 405 Method Not Allowed when called directly, even with GET requests.

## Root Cause
theMarketer's REST API is designed for server-to-server communication and may require:
1. IP whitelisting (see screenshot - IP Whitelisting section)
2. Special authentication headers
3. Different endpoint format than documented publicly

## Recommended Solutions

### Option 1: Contact theMarketer Support (BEST)
Reach out to theMarketer support with:
- Your Customer Key: `66ea9ec3288002c6100343`
- Question: "What is the correct endpoint and method to programmatically subscribe users to newsletter via REST API?"
- Ask about IP whitelisting requirements

### Option 2: Use theMarketer's JavaScript Pixel (CLIENT-SIDE)
Add their tracking script to your page:
```html
<script type="text/javascript">
(function(d, s, id) {
  var js, fjs = d.getElementsByTagName(s)[0];
  if (d.getElementById(id)) return;
  js = d.createElement(s); js.id = id;
  js.src = "https://t.themarketer.com/track.js";
  fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'themarketer-jssdk'));
</script>
```

### Option 3: Manual CSV Export (INTERIM SOLUTION)
I can set up a simple solution that:
1. Collects emails locally (browser localStorage or simple backend database)
2. Exports to CSV
3. You manually import to theMarketer

### Option 4: Use theMarketer's Built-in Forms
Create a subscription form directly in theMarketer dashboard and embed it on your page.

## What We Tried
✅ POST to `/api/v1/customers` - 405 Method Not Allowed
✅ POST to `/api/v1/save_customer` - 405 Method Not Allowed  
✅ GET to `/api/v1/save_customer` - 405 Method Not Allowed
✅ POST to `/api/v1/opt_in_settings/save` - 405 Method Not Allowed
✅ GET to `/api/v1/opt_in_settings/save` - 405 Method Not Allowed

All endpoints require authentication but still return 405, suggesting they need additional setup (IP whitelisting or different auth method).

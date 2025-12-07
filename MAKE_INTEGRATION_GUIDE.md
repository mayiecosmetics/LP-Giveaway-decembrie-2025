# Make.com + theMarketer Integration Setup

## Step 1: Create a Make.com Scenario

1. Go to [make.com](https://www.make.com) and log in
2. Click **"Create a new scenario"**
3. Add **"Webhooks"** as the first module
4. Select **"Custom webhook"**
5. Click **"Add"** to create a new webhook
6. Copy the webhook URL (looks like: `https://hook.eu1.make.com/xxxxxxxxxxxxx`)

## Step 2: Configure theMarketer Module in Make.com

1. Add a new module after the webhook
2. Search for **"theMarketer"** in the apps list
3. Select the action: **"Subscribe to Newsletter"** or **"Create/Update Customer"**
4. Connect your theMarketer account (using your API keys from the screenshot)
5. Map the fields from the webhook:
   - **Email**: `{{1.email}}`
   - **First Name**: `{{1.firstname}}`
   - **Newsletter Consent**: `{{1.gdpr_consent}}`
   - **Source/Tags**: `{{1.source}}` (will be "giveaway_decembrie_2025")

## Step 3: Update the Landing Page

Open `script.js` and replace line 1-3:

```javascript
const MAKE_WEBHOOK_URL = 'https://hook.eu1.make.com/xxxxxxxxxxxxx';
```

Replace `xxxxxxxxxxxxx` with your actual webhook URL from Step 1.

## Step 4: Test the Integration

1. In Make.com, turn on the scenario
2. Click "Run once" to start listening for webhooks
3. Submit the form on your landing page
4. Check Make.com to see if the data was received
5. Verify in theMarketer that the subscriber was added

## Data Sent to Make.com

The webhook receives:
```json
{
  "email": "user@example.com",
  "firstname": "John",
  "gdpr_consent": true,
  "source": "giveaway_decembrie_2025",
  "timestamp": "2025-12-07T12:00:00.000Z",
  "page_url": "https://mayie.ro/giveaway"
}
```

## Benefits of This Approach

✅ No API keys exposed in frontend code
✅ Flexible - can add more actions (email notifications, Slack alerts, etc.)
✅ theMarketer integration officially supported by Make.com
✅ Can add data transformation, validation, or enrichment in Make.com
✅ Easy to monitor and debug via Make.com dashboard

## Troubleshooting

**Form shows "Configurare incompletă"**: The webhook URL is not set in script.js

**Make.com doesn't receive data**: Check browser console (F12) for errors

**theMarketer doesn't show subscriber**: Check Make.com execution history to see if theMarketer module ran successfully

# Donation App Email Backend

Express.js backend service for sending emails via **Brevo (Sendinblue) API**. This service handles donation notification and thank you emails for the Donation App.

## Features

- ✉️ Send donation notification emails to campaign owners
- 💚 Send thank you emails to donors
- 🎉 Send campaign approval/rejection emails
- 🎯 Send campaign completion emails
- 🎨 Beautiful HTML email templates with responsive design
- 🔒 Secure API-based email sending (no SMTP ports required)
- 🚀 **Ready for deployment on Render** (Brevo uses HTTP API, not blocked SMTP ports)

## Prerequisites

- Node.js 14.0.0 or higher
- Brevo (Sendinblue) account with API key

## Local Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Get Brevo API Key

1. Sign up for a free account at [Brevo (Sendinblue)](https://www.brevo.com/)
2. Go to **Settings** → **SMTP & API** → **API Keys**
3. Create a new API key and copy it
4. Free tier includes **300 emails/day**

### 3. Configure Environment Variables

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Edit `.env` with your Brevo credentials:

```env
# Server Configuration
PORT=3000

# Brevo (Sendinblue) API Configuration
BREVO_API_KEY=your_brevo_api_key_here

# Email Configuration
FROM_EMAIL=noreply@yourdomain.com
FROM_NAME=Donation App

# App Configuration
APP_NAME=Donation App
APP_URL=https://your-app-url.com
SUPPORT_EMAIL=support@yourdomain.com

# CORS Configuration
ALLOWED_ORIGINS=*
```

### 4. Verify Sender Email in Brevo

1. Go to Brevo Dashboard → **Senders**
2. Add and verify your `FROM_EMAIL` address
3. Follow the verification email instructions

### 5. Start the Server

Development mode (with auto-reload):

```bash
npm run dev
```

Production mode:

```bash
npm start
```

The server will start on `http://localhost:3000`

## API Endpoints

### Health Check

```
GET /api/health
```

Response:

```json
{
  "status": "ok",
  "message": "Email service is running",
  "timestamp": "2024-12-03T12:00:00.000Z"
}
```

### Send Single Email

```
POST /api/send-email
```

Request body:

```json
{
  "type": "donation-notification" | "thank-you" | "campaign-approval" | "campaign-rejection" | "campaign-completion",
  "to": "recipient@example.com",
  "data": {
    // For donation-notification:
    "campaignOwnerName": "John Doe",
    "campaignTitle": "Help Build a School",
    "donorName": "Jane Smith",
    "amount": 100,
    "message": "Keep up the great work!",
    "isAnonymous": false,
    "totalRaised": 5000,
    "targetAmount": 10000,

    // For thank-you:
    "donorName": "Jane Smith",
    "campaignTitle": "Help Build a School",
    "campaignOwnerName": "John Doe",
    "amount": 100,
    "message": "Happy to help!",
    "isAnonymous": false,

    // For campaign-approval:
    "ownerName": "John Doe",
    "campaignTitle": "Help Build a School",
    "campaignId": "abc123",
    "approvalMessage": "Great campaign!",

    // For campaign-rejection:
    "ownerName": "John Doe",
    "campaignTitle": "Help Build a School",
    "campaignId": "abc123",
    "rejectionReason": "Please add more details",

    // For campaign-completion:
    "ownerName": "John Doe",
    "campaignTitle": "Help Build a School",
    "targetAmount": 10000,
    "totalRaised": 10500,
    "donorCount": 50,
    "campaignDuration": 2592000000
  }
}
```

### Send Donation Emails (Batch)

```
POST /api/send-donation-emails
```

Sends both notification and thank you emails in one request.

Request body:

```json
{
  "campaignOwnerEmail": "owner@example.com",
  "donorEmail": "donor@example.com",
  "donationData": {
    "campaignOwnerName": "John Doe",
    "campaignTitle": "Help Build a School",
    "donorName": "Jane Smith",
    "amount": 100,
    "message": "Keep up the great work!",
    "isAnonymous": false,
    "totalRaised": 5000,
    "targetAmount": 10000
  }
}
```

Response:

```json
{
  "success": true,
  "notificationSent": true,
  "thankYouSent": true,
  "errors": []
}
```

## Deployment to Render

### 1. Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/yourusername/email-backend.git
git push -u origin main
```

### 2. Deploy on Render

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Configure:
   - **Name**: `donation-app-email-service`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Instance Type**: Free

### 3. Add Environment Variables

In Render dashboard, add all environment variables:

- `PORT` = 3000
- `BREVO_API_KEY` = your_brevo_api_key
- `FROM_EMAIL` = noreply@yourdomain.com
- `FROM_NAME` = Donation App
- `APP_NAME` = Donation App
- `APP_URL` = https://your-app-url.com
- `SUPPORT_EMAIL` = support@your-app.com
- `ALLOWED_ORIGINS` = \*

### 4. Deploy

Click "Create Web Service" and wait for deployment to complete.

Your backend will be available at: `https://your-service-name.onrender.com`

## Why Brevo Instead of SMTP?

✅ **Render Compatible**: Brevo uses HTTP API instead of SMTP ports (25, 465, 587) which are blocked by Render  
✅ **Free Tier**: 300 emails/day for free  
✅ **Reliable**: Better deliverability than Gmail SMTP  
✅ **No Port Restrictions**: Works on any hosting platform  
✅ **Easy Setup**: Just need an API key, no complex SMTP configuration

## Testing

### Test with curl

Health check:

```bash
curl https://your-service-name.onrender.com/api/health
```

Send test email:

```bash
curl -X POST https://your-service-name.onrender.com/api/send-email \
  -H "Content-Type: application/json" \
  -d '{
    "type": "thank-you",
    "to": "test@example.com",
    "data": {
      "donorName": "Test User",
      "campaignTitle": "Test Campaign",
      "campaignOwnerName": "Campaign Owner",
      "amount": 50,
      "isAnonymous": false
    }
  }'
```

## Troubleshooting

### API Key Error

- Verify `BREVO_API_KEY` is set correctly
- Check if API key is active in Brevo dashboard
- Ensure no extra spaces in the API key

### Email Not Sent

- Verify sender email is verified in Brevo dashboard
- Check Brevo account limits (300 emails/day on free tier)
- Check server logs for detailed error messages

### CORS Error

- Add your React Native app's origin to `ALLOWED_ORIGINS`
- For development, use `*` to allow all origins
- For production, specify exact origins: `https://your-app.com,https://api.your-app.com`

### Email Not Received

- Check spam/junk folder
- Verify recipient email address is correct
- Check Brevo dashboard for email logs
- Ensure sender email is verified

## Project Structure

```
email-backend/
├── server.js              # Express server and API endpoints
├── emailTemplates.js      # HTML email templates
├── package.json           # Dependencies
├── .env                   # Environment variables (not in git)
├── .env.example          # Environment template
├── .gitignore            # Git ignore rules
└── README.md             # This file
```

## License

ISC

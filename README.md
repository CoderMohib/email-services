# Donation App Email Backend

Express.js backend service for sending emails via Nodemailer and SMTP. This service handles donation notification and thank you emails for the Donation App.

## Features

- ✉️ Send donation notification emails to campaign owners
- 💚 Send thank you emails to donors
- 🎨 Beautiful HTML email templates with responsive design
- 🔒 Secure SMTP configuration
- 🚀 Ready for deployment on Render

## Prerequisites

- Node.js 14.0.0 or higher
- SMTP email account (Gmail, SendGrid, etc.)

## Local Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Edit `.env` with your SMTP credentials:

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# SMTP Configuration (Gmail example)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-specific-password

# Email Sender Info
EMAIL_FROM_NAME=Donation App
EMAIL_FROM_ADDRESS=your-email@gmail.com

# App Configuration
APP_NAME=Donation App
APP_URL=https://your-app-url.com
SUPPORT_EMAIL=support@your-app.com

# CORS Configuration
ALLOWED_ORIGINS=*
```

### 3. Gmail Setup (if using Gmail)

1. Enable 2-Factor Authentication on your Google account
2. Generate an App Password:
   - Go to Google Account Settings → Security → 2-Step Verification → App passwords
   - Select "Mail" and "Other (Custom name)"
   - Copy the generated password and use it as `SMTP_PASS`

### 4. Start the Server

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
  "timestamp": "2024-12-02T12:00:00.000Z"
}
```

### Send Single Email

```
POST /api/send-email
```

Request body:

```json
{
  "type": "donation-notification" | "thank-you",
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
    "isAnonymous": false
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

In Render dashboard, add all environment variables from `.env`:

- `PORT` = 3000
- `NODE_ENV` = production
- `SMTP_HOST` = smtp.gmail.com
- `SMTP_PORT` = 587
- `SMTP_SECURE` = false
- `SMTP_USER` = your-email@gmail.com
- `SMTP_PASS` = your-app-password
- `EMAIL_FROM_NAME` = Donation App
- `EMAIL_FROM_ADDRESS` = your-email@gmail.com
- `APP_NAME` = Donation App
- `APP_URL` = https://your-app-url.com
- `SUPPORT_EMAIL` = support@your-app.com
- `ALLOWED_ORIGINS` = \*

### 4. Deploy

Click "Create Web Service" and wait for deployment to complete.

Your backend will be available at: `https://your-service-name.onrender.com`

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

### SMTP Connection Error

- Verify SMTP credentials are correct
- For Gmail, ensure App Password is used (not regular password)
- Check if 2FA is enabled on your email account
- Verify SMTP_HOST and SMTP_PORT are correct

### CORS Error

- Add your React Native app's origin to `ALLOWED_ORIGINS`
- For development, use `*` to allow all origins
- For production, specify exact origins: `https://your-app.com,https://api.your-app.com`

### Email Not Received

- Check spam/junk folder
- Verify recipient email address is correct
- Check server logs for errors
- Test SMTP connection with a simple test email

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

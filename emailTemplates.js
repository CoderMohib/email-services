/**
 * Email template functions for Donation App
 * Ported from React Native app to maintain consistent styling
 */

const appConfig = {
  appName: process.env.APP_NAME || "Donation App",
  appUrl: process.env.APP_URL || "https://your-app-url.com",
  supportEmail: process.env.SUPPORT_EMAIL || "support@your-app.com",
};

/**
 * Base HTML email template with responsive design
 */
const createBaseTemplate = (content) => {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>${appConfig.appName}</title>
    <style>
        /* Reset styles */
        body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
        table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
        img { -ms-interpolation-mode: bicubic; border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; }
        
        /* Base styles */
        body {
            margin: 0;
            padding: 0;
            width: 100% !important;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            background-color: #f5f5f5;
        }
        
        /* Container */
        .email-container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
        }
        
        /* Header */
        .header {
            background: linear-gradient(135deg, #ff7a5e 0%, #f55d3d 100%);
            padding: 30px 20px;
            text-align: center;
        }
        
        .logo {
            max-width: 120px;
            height: auto;
        }
        
        /* Content */
        .content {
            padding: 40px 30px;
            color: #333333;
            line-height: 1.6;
        }
        
        .content h1 {
            color: #1f2937;
            font-size: 28px;
            margin: 0 0 20px 0;
            font-weight: 700;
        }
        
        .content p {
            margin: 0 0 15px 0;
            font-size: 16px;
            color: #4b5563;
        }
        
        /* Card */
        .card {
            background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
            border-left: 4px solid #10b981;
            padding: 20px;
            margin: 25px 0;
            border-radius: 8px;
        }
        
        .card-primary {
            background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
            border-left: 4px solid #f59e0b;
        }
        
        .card-title {
            font-size: 14px;
            color: #6b7280;
            margin: 0 0 8px 0;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            font-weight: 600;
        }
        
        .card-value {
            font-size: 32px;
            color: #1f2937;
            margin: 0;
            font-weight: 700;
        }
        
        /* Button */
        .button {
            display: inline-block;
            padding: 14px 32px;
            background: linear-gradient(135deg, #ff7a5e 0%, #f55d3d 100%);
            color: #ffffff !important;
            text-decoration: none;
            border-radius: 25px;
            font-weight: 600;
            font-size: 16px;
            margin: 20px 0;
            box-shadow: 0 4px 6px rgba(245, 93, 61, 0.3);
        }
        
        .button:hover {
            background: linear-gradient(135deg, #f55d3d 0%, #ff7a5e 100%);
        }
        
        /* Info box */
        .info-box {
            background-color: #f9fafb;
            border: 1px solid #e5e7eb;
            border-radius: 8px;
            padding: 20px;
            margin: 20px 0;
        }
        
        .info-row {
            display: flex;
            justify-content: space-between;
            padding: 10px 0;
            border-bottom: 1px solid #e5e7eb;
        }
        
        .info-row:last-child {
            border-bottom: none;
        }
        
        .info-label {
            font-weight: 600;
            color: #6b7280;
            font-size: 14px;
        }
        
        .info-value {
            color: #1f2937;
            font-size: 14px;
            text-align: right;
        }
        
        /* Footer */
        .footer {
            background-color: #1f2937;
            padding: 30px 20px;
            text-align: center;
            color: #9ca3af;
            font-size: 14px;
        }
        
        .footer p {
            margin: 5px 0;
        }
        
        .footer a {
            color: #60a5fa;
            text-decoration: none;
        }
        
        .no-reply {
            background-color: #fef3c7;
            border: 1px solid #fbbf24;
            padding: 12px 20px;
            margin: 20px 0;
            border-radius: 6px;
            font-size: 13px;
            color: #92400e;
        }
        
        /* Responsive */
        @media only screen and (max-width: 600px) {
            .content {
                padding: 30px 20px !important;
            }
            
            .content h1 {
                font-size: 24px !important;
            }
            
            .card-value {
                font-size: 28px !important;
            }
        }
    </style>
</head>
<body>
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #f5f5f5;">
        <tr>
            <td style="padding: 20px 0;">
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" class="email-container">
                    <!-- Header -->
                    <tr>
                        <td class="header">
                            <h2 style="color: white; margin: 0;">${appConfig.appName}</h2>
                        </td>
                    </tr>
                    
                    <!-- Content -->
                    <tr>
                        <td class="content">
                            ${content}
                        </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                        <td class="footer">
                            <p style="margin: 0 0 10px 0; font-weight: 600; color: #ffffff;">${appConfig.appName}</p>
                            <p>Making a difference, one donation at a time 💚</p>
                            <p style="margin: 15px 0 5px 0;">
                                <a href="${appConfig.appUrl}">Visit Website</a> | 
                                <a href="mailto:${appConfig.supportEmail}">Contact Support</a>
                            </p>
                            <p style="font-size: 12px; margin-top: 15px;">
                                This is an automated message, please do not reply to this email.
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
    `.trim();
};

/**
 * Email template for campaign owner when they receive a donation
 */
const createDonationNotificationEmail = (data) => {
  const {
    campaignOwnerName,
    campaignTitle,
    donorName,
    amount,
    message,
    isAnonymous,
    totalRaised,
    targetAmount,
  } = data;

  const displayName = isAnonymous ? "An anonymous supporter" : donorName;
  const progressPercentage = Math.min(
    Math.round((totalRaised / targetAmount) * 100),
    100
  );

  const content = `
        <h1>🎉 You received a new donation!</h1>
        
        <p>Dear ${campaignOwnerName},</p>
        
        <p>Great news! ${displayName} just made a donation to your campaign <strong>"${campaignTitle}"</strong>.</p>
        
        <!-- Donation Amount Card -->
        <div class="card card-primary">
            <p class="card-title">Donation Amount</p>
            <p class="card-value">$${amount.toFixed(2)}</p>
        </div>
        
        ${
          message
            ? `
        <div class="info-box">
            <p style="margin: 0 0 8px 0; font-weight: 600; color: #6b7280; font-size: 14px;">💬 Donor's Message:</p>
            <p style="margin: 0; color: #1f2937; font-style: italic;">"${message}"</p>
        </div>
        `
            : ""
        }
        
        <!-- Campaign Progress -->
        <div class="card">
            <p class="card-title">Campaign Progress</p>
            <div style="margin-top: 15px;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                    <span style="font-size: 14px; color: #6b7280;">Total Raised</span>
                    <span style="font-size: 16px; font-weight: 700; color: #10b981;">$${totalRaised.toFixed(
                      2
                    )}</span>
                </div>
                <div style="background-color: #e5e7eb; height: 10px; border-radius: 5px; overflow: hidden;">
                    <div style="background: linear-gradient(90deg, #10b981 0%, #059669 100%); height: 100%; width: ${progressPercentage}%; transition: width 0.3s ease;"></div>
                </div>
                <div style="display: flex; justify-content: space-between; margin-top: 8px;">
                    <span style="font-size: 14px; color: #6b7280;">${progressPercentage}% of goal</span>
                    <span style="font-size: 14px; color: #6b7280;">Goal: $${targetAmount.toFixed(
                      2
                    )}</span>
                </div>
            </div>
        </div>
        
        <p>Every donation brings you closer to your goal. Keep up the great work and continue sharing your campaign!</p>
        
        <div style="text-align: center;">
            <a href="#" class="button">View Campaign Dashboard</a>
        </div>
        
        <div class="no-reply">
            <strong>📧 This is a no-reply email.</strong> If you have any questions, please contact our support team.
        </div>
        
        <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">
            Thank you for making a difference with ${campaignTitle}!
        </p>
    `;

  return createBaseTemplate(content);
};

/**
 * Email template for donors to thank them for their donation
 */
const createThankYouEmail = (data) => {
  const {
    donorName,
    campaignTitle,
    campaignOwnerName,
    amount,
    message,
    isAnonymous,
  } = data;

  const content = `
        <h1>💚 Thank You for Your Generous Donation!</h1>
        
        <p>Dear ${donorName},</p>
        
        <p>Thank you for your incredible generosity! Your donation to <strong>"${campaignTitle}"</strong> has been successfully processed.</p>
        
        <!-- Donation Receipt Card -->
        <div class="card card-primary">
            <p class="card-title">Your Donation</p>
            <p class="card-value">$${amount.toFixed(2)}</p>
        </div>
        
        <!-- Donation Details -->
        <div class="info-box">
            <div class="info-row">
                <span class="info-label">Campaign</span>
                <span class="info-value">${campaignTitle}</span>
            </div>
            <div class="info-row">
                <span class="info-label">Campaign Owner</span>
                <span class="info-value">${campaignOwnerName}</span>
            </div>
            <div class="info-row">
                <span class="info-label">Amount Donated</span>
                <span class="info-value" style="font-weight: 700; color: #10b981;">$${amount.toFixed(
                  2
                )}</span>
            </div>
            <div class="info-row">
                <span class="info-label">Date</span>
                <span class="info-value">${new Date().toLocaleDateString(
                  "en-US",
                  { year: "numeric", month: "long", day: "numeric" }
                )}</span>
            </div>
            ${
              isAnonymous
                ? `
            <div class="info-row">
                <span class="info-label">Visibility</span>
                <span class="info-value">Anonymous</span>
            </div>
            `
                : ""
            }
        </div>
        
        ${
          message
            ? `
        <div class="card">
            <p class="card-title">Your Message</p>
            <p style="margin: 10px 0 0 0; color: #1f2937; font-style: italic;">"${message}"</p>
        </div>
        `
            : ""
        }
        
        <!-- Impact Message -->
        <div class="card">
            <p style="margin: 0 0 10px 0; font-size: 18px; font-weight: 700; color: #1f2937;">
                🌟 You're Making a Real Difference!
            </p>
            <p style="margin: 0; color: #4b5563; font-size: 15px;">
                Your contribution of <strong>$${amount.toFixed(
                  2
                )}</strong> is helping ${campaignOwnerName} achieve their goal. 
                Together, we're creating positive change in our community.
            </p>
        </div>
        
        <p>Your support means the world to those you're helping. Every donation, no matter the size, makes a meaningful impact.</p>
        
        <div style="text-align: center;">
            <a href="#" class="button">View Campaign Progress</a>
        </div>
        
        <p style="text-align: center; margin: 25px 0; color: #6b7280; font-size: 14px;">
            Want to make an even bigger impact? Share this campaign with your friends and family!
        </p>
        
        <div class="no-reply">
            <strong>📧 This is a no-reply email.</strong> If you have any questions about your donation, please contact our support team.
        </div>
        
        <p style="color: #6b7280; font-size: 14px; margin-top: 30px; text-align: center;">
            Thank you for being a changemaker! 🙏
        </p>
    `;

  return createBaseTemplate(content);
};

module.exports = {
  createDonationNotificationEmail,
  createThankYouEmail,
};

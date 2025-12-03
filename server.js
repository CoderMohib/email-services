require("dotenv").config();
const express = require("express");
const SibApiV3Sdk = require("@sendinblue/client");
const cors = require("cors");
const {
  createDonationNotificationEmail,
  createThankYouEmail,
  createCampaignApprovalEmail,
  createCampaignRejectionEmail,
  createCampaignCompletionEmail,
} = require("./emailTemplates");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// CORS configuration
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(",")
  : ["*"];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes("*") || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

// Initialize Brevo (Sendinblue) API client
const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
apiInstance.setApiKey(
  SibApiV3Sdk.TransactionalEmailsApiApiKeys.apiKey,
  process.env.BREVO_API_KEY
);

// Verify Brevo API key on startup
if (!process.env.BREVO_API_KEY) {
  console.error("❌ BREVO_API_KEY is not set in environment variables");
} else {
  console.log("✅ Brevo API client initialized successfully");
}

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    message: "Email service is running",
    timestamp: new Date().toISOString(),
  });
});

// Send email endpoint
app.post("/api/send-email", async (req, res) => {
  try {
    const { type, to, data } = req.body;

    // Validate request
    if (!type || !to || !data) {
      return res.status(400).json({
        success: false,
        error: "Missing required fields: type, to, data",
      });
    }

    // Validate Brevo API key
    if (!process.env.BREVO_API_KEY) {
      return res.status(500).json({
        success: false,
        error: "BREVO_API_KEY is not configured",
      });
    }

    if (!process.env.FROM_EMAIL) {
      return res.status(500).json({
        success: false,
        error: "FROM_EMAIL is not configured",
      });
    }

    let htmlContent;
    let subject;

    // Generate email based on type
    if (type === "donation-notification") {
      subject = `🎉 New Donation Received for "${data.campaignTitle}"`;
      htmlContent = createDonationNotificationEmail(data);
    } else if (type === "thank-you") {
      subject = `💚 Thank You for Your Donation to "${data.campaignTitle}"`;
      htmlContent = createThankYouEmail(data);
    } else if (type === "campaign-approval") {
      subject = `🎉 Your Campaign Has Been Approved!`;
      htmlContent = createCampaignApprovalEmail(data);
    } else if (type === "campaign-rejection") {
      subject = `Campaign Review Update - Action Required`;
      htmlContent = createCampaignRejectionEmail(data);
    } else if (type === "campaign-completion") {
      subject = `🎯 Congratulations! Campaign Goal Reached!`;
      htmlContent = createCampaignCompletionEmail(data);
    } else {
      return res.status(400).json({
        success: false,
        error:
          'Invalid email type. Must be one of: "donation-notification", "thank-you", "campaign-approval", "campaign-rejection", "campaign-completion"',
      });
    }

    // Prepare Brevo email object
    const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
    sendSmtpEmail.sender = {
      email: process.env.FROM_EMAIL,
      name: process.env.FROM_NAME || "Donation App",
    };
    sendSmtpEmail.to = [{ email: to }];
    sendSmtpEmail.subject = subject;
    sendSmtpEmail.htmlContent = htmlContent;

    // Send email via Brevo
    console.log(`📧 Sending ${type} email to: ${to}`);
    console.log(`📧 Using sender: ${process.env.FROM_EMAIL}`);

    const response = await apiInstance.sendTransacEmail(sendSmtpEmail);

    console.log("✅ Email sent successfully!");
    console.log("📬 Message ID:", response.messageId || response);

    res.json({
      success: true,
      messageId: response.messageId || response,
      message: "Email sent successfully",
    });
  } catch (error) {
    console.error("❌ Error sending email:");
    console.error("Error details:", error.message || error);
    console.error("Full error:", error.response?.body || error);

    res.status(500).json({
      success: false,
      error: error.message || "Failed to send email",
      details: error.response?.body || null,
    });
  }
});

// Batch send emails endpoint (for sending both notification and thank you)
app.post("/api/send-donation-emails", async (req, res) => {
  try {
    const { campaignOwnerEmail, donorEmail, donationData } = req.body;

    // Validate request
    if (!campaignOwnerEmail || !donorEmail || !donationData) {
      return res.status(400).json({
        success: false,
        error:
          "Missing required fields: campaignOwnerEmail, donorEmail, donationData",
      });
    }

    const results = {
      notificationSent: false,
      thankYouSent: false,
      errors: [],
    };

    // Send notification to campaign owner
    try {
      const notificationHtml = createDonationNotificationEmail(donationData);
      const notificationSubject = `🎉 New Donation Received for "${donationData.campaignTitle}"`;

      const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
      sendSmtpEmail.sender = {
        email: process.env.FROM_EMAIL,
        name: process.env.FROM_NAME || "Donation App",
      };
      sendSmtpEmail.to = [{ email: campaignOwnerEmail }];
      sendSmtpEmail.subject = notificationSubject;
      sendSmtpEmail.htmlContent = notificationHtml;

      await apiInstance.sendTransacEmail(sendSmtpEmail);

      results.notificationSent = true;
      console.log(`✅ Notification email sent to: ${campaignOwnerEmail}`);
    } catch (error) {
      console.error("❌ Error sending notification email:", error);
      results.errors.push(`Campaign owner notification: ${error.message}`);
    }

    // Send thank you to donor
    try {
      const thankYouHtml = createThankYouEmail({
        donorName: donationData.donorName,
        campaignTitle: donationData.campaignTitle,
        campaignOwnerName: donationData.campaignOwnerName,
        amount: donationData.amount,
        message: donationData.message,
        isAnonymous: donationData.isAnonymous,
      });
      const thankYouSubject = `💚 Thank You for Your Donation to "${donationData.campaignTitle}"`;

      const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
      sendSmtpEmail.sender = {
        email: process.env.FROM_EMAIL,
        name: process.env.FROM_NAME || "Donation App",
      };
      sendSmtpEmail.to = [{ email: donorEmail }];
      sendSmtpEmail.subject = thankYouSubject;
      sendSmtpEmail.htmlContent = thankYouHtml;

      await apiInstance.sendTransacEmail(sendSmtpEmail);

      results.thankYouSent = true;
      console.log(`✅ Thank you email sent to: ${donorEmail}`);
    } catch (error) {
      console.error("❌ Error sending thank you email:", error);
      results.errors.push(`Donor thank you: ${error.message}`);
    }

    // Return results
    const allSuccess = results.notificationSent && results.thankYouSent;
    res.status(allSuccess ? 200 : 207).json({
      success: allSuccess,
      ...results,
    });
  } catch (error) {
    console.error("❌ Error in batch email sending:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Failed to send emails",
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Server error:", err);
  res.status(500).json({
    success: false,
    error: err.message || "Internal server error",
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Email service running on port ${PORT}`);
  console.log(`📧 Email Provider: Brevo (Sendinblue)`);
  console.log(
    `📬 From: ${process.env.FROM_NAME || "Donation App"} <${
      process.env.FROM_EMAIL
    }>`
  );
});

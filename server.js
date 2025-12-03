require("dotenv").config();
const express = require("express");
const nodemailer = require("nodemailer");
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

// Create Nodemailer transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: process.env.SMTP_SECURE === "true", // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// Verify SMTP connection on startup
transporter.verify((error, success) => {
  if (error) {
    console.error("❌ SMTP connection error:", error);
  } else {
    console.log("✅ SMTP server is ready to send emails");
  }
});

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

    // Email options
    const mailOptions = {
      from: `${process.env.EMAIL_FROM_ADDRESS}`,
      to: to,
      subject: subject,
      html: htmlContent,
    };

    // Send email
    console.log(`📧 Sending ${type} email to: ${to}`);
    const info = await transporter.sendMail(mailOptions);

    console.log("✅ Email sent successfully!");
    console.log("📬 Message ID:", info.messageId);

    res.json({
      success: true,
      messageId: info.messageId,
      message: "Email sent successfully",
    });
  } catch (error) {
    console.error("❌ Error sending email:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Failed to send email",
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

      await transporter.sendMail({
        from: `${process.env.EMAIL_FROM_ADDRESS}`,
        to: campaignOwnerEmail,
        subject: notificationSubject,
        html: notificationHtml,
      });

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

      await transporter.sendMail({
        from: `${process.env.EMAIL_FROM_ADDRESS}`,
        to: donorEmail,
        subject: thankYouSubject,
        html: thankYouHtml,
      });

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
  console.log(`📧 SMTP Host: ${process.env.SMTP_HOST}`);
  console.log(
    `📬 From: ${process.env.EMAIL_FROM_NAME} <${process.env.EMAIL_FROM_ADDRESS}>`
  );
});

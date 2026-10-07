const express = require("express");
const router = express.Router();
const {
  scanQr,
  confirmExit,
  confirmEntry,
  getStudentsOutside,
} = require("../controllers/securityController");
const protect = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");
const { sendEmail } = require("../services/emailService");

router.use(protect, authorizeRoles("Security"));

router.post("/scan", scanQr);
router.post("/scan/confirm-exit", confirmExit);
router.post("/scan/confirm-entry", confirmEntry);
router.get("/outside", getStudentsOutside);

router.post("/test-sms", async (req, res) => {
  try {
    const { sendSms } = require("../services/smsService");

    await sendSms(
      req.body.phone,
      "SLOMS test SMS: TextBee SMS integration is working successfully.",
    );

    res.status(200).json({
      message: "Test SMS sent successfully",
    });
  } catch (error) {
    console.error("TEST SMS ERROR:", error);

    res.status(500).json({
      message: error.message || "Failed to send test SMS",
    });
  }
});

router.post("/test-email", async (req, res) => {
  try {
    await sendEmail({
      to: "sloms.college@gmail.com",
      toName: "SLOMS Test",
      subject: "SLOMS Email Test",
      htmlContent: `
        <h2>SLOMS Email Test</h2>
        <p>This is a test email from the SLOMS backend.</p>
        <p>Brevo email integration is working successfully.</p>
      `,
    });

    res.status(200).json({
      message: "Test email sent successfully",
    });
  } catch (error) {
    console.error("TEST EMAIL ERROR:", error);
    res.status(500).json({
      message: error.message,
    });
  }
});

module.exports = router;

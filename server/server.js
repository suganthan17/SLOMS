const dotenv = require("dotenv");
dotenv.config(); // MUST be first, before any other require()

const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const leaveRoutes = require("./routes/leaveRoutes");
const facultyRoutes = require("./routes/facultyRoutes");
const securityRoutes = require("./routes/securityRoutes");
const adminRoutes = require("./routes/adminRoutes");

const { sendEmail } = require("./services/emailService");

process.on("unhandledRejection", (reason) => {
  console.error("UNHANDLED REJECTION:", reason);
});

process.on("uncaughtException", (err) => {
  console.error("UNCAUGHT EXCEPTION:", err);
});

connectDB();

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  }),
);

app.get("/test-email", async (req, res) => {
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

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/leaves", leaveRoutes);
app.use("/api/faculty", facultyRoutes);
app.use("/api/security", securityRoutes);
app.use("/api/admin", adminRoutes);
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Internal server error" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

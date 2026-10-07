const Leave = require("../models/Leave");
const User = require("../models/User");
const QRCode = require("qrcode");
const { sendEmail } = require("../services/emailService");

// POST /api/leaves  (student applies)
const applyLeave = async (req, res) => {
  try {
    const { reason, fromDateTime, toDateTime } = req.body;

    if (!reason || !fromDateTime || !toDateTime) {
      return res.status(400).json({
        message: "Reason, fromDateTime, and toDateTime are required",
      });
    }

    if (new Date(fromDateTime) > new Date(toDateTime)) {
      return res.status(400).json({
        message: "fromDateTime cannot be after toDateTime",
      });
    }

    if (new Date(fromDateTime) < new Date()) {
      return res.status(400).json({
        message: "fromDateTime cannot be in the past",
      });
    }

    const leave = await Leave.create({
      student: req.user._id,
      reason,
      fromDateTime,
      toDateTime,
      status: "Pending",
    });

    try {
      const faculties = await User.find({
        role: "Faculty",
        department: req.user.department,
        status: "Active",
      }).select("name email");

      const fromTime = new Date(fromDateTime).toLocaleString("en-IN", {
        timeZone: "Asia/Kolkata",
        dateStyle: "medium",
        timeStyle: "short",
      });

      const toTime = new Date(toDateTime).toLocaleString("en-IN", {
        timeZone: "Asia/Kolkata",
        dateStyle: "medium",
        timeStyle: "short",
      });

      for (const faculty of faculties) {
        if (!faculty.email) continue;

        await sendEmail({
          to: faculty.email,
          toName: faculty.name,
          subject: "New Leave Request - SLOMS",
          htmlContent: `
            <h2>New Leave Request</h2>

            <p>A new leave request has been submitted by a student.</p>

            <p>
              <strong>Student Name:</strong> ${req.user.name}<br>
              <strong>Register Number:</strong> ${req.user.registerNumber || "N/A"}<br>
              <strong>Department:</strong> ${req.user.department || "N/A"}<br>
              <strong>From:</strong> ${fromTime}<br>
              <strong>To:</strong> ${toTime}<br>
              <strong>Reason:</strong> ${reason}
            </p>

            <p>Please login to SLOMS to review and process this leave request.</p>

            <p>
              <strong>SLOMS - Student Leave & Outpass Management System</strong>
            </p>
          `,
        });
      }

      console.log(
        `Leave notification emails sent to ${faculties.length} faculty member(s)`,
      );
    } catch (emailError) {
      console.error("LEAVE EMAIL ERROR:", emailError);
    }

    res.status(201).json(leave);
  } catch (err) {
    console.error("APPLY LEAVE ERROR:", err);
    res.status(500).json({
      message: "Server error while applying leave",
    });
  }
};

// GET /api/leaves/my  (student's own leaves, optional ?status=Pending)
const getMyLeaves = async (req, res) => {
  try {
    const { status } = req.query;
    const filter = { student: req.user._id };
    if (status && status !== "All") filter.status = status;

    const leaves = await Leave.find(filter).sort({ createdAt: -1 });
    res.status(200).json({ leaves });
  } catch (err) {
    console.error("GET MY LEAVES ERROR:", err);
    res.status(500).json({ message: "Server error while fetching leaves" });
  }
};

// GET /api/leaves/my/outpasses  (approved leaves only, used for the Outpass page)
const getMyOutpasses = async (req, res) => {
  try {
    const leaves = await Leave.find({
      student: req.user._id,
      status: "Approved",
    }).sort({ fromDateTime: -1 });

    res.status(200).json({ leaves });
  } catch (err) {
    console.error("GET MY OUTPASSES ERROR:", err);
    res.status(500).json({
      message: "Server error while fetching outpasses",
    });
  }
};
const getOutpassQr = async (req, res) => {
  try {
    const leave = await Leave.findOne({
      _id: req.params.id,
      student: req.user._id,
    });

    if (!leave) {
      return res.status(404).json({
        message: "Outpass not found",
      });
    }

    if (leave.status !== "Approved") {
      return res.status(400).json({
        message: "Outpass is not approved",
      });
    }

    if (leave.outpassStatus === "Completed") {
      return res.status(400).json({
        message: "This outpass has already been completed",
      });
    }

    if (!leave.qrToken) {
      return res.status(400).json({
        message: "QR code is not available",
      });
    }

    const qrDataUrl = await QRCode.toDataURL(leave.qrToken, {
      width: 300,
      margin: 1,
    });

    res.status(200).json({ qrDataUrl });
  } catch (err) {
    console.error("GET OUTPASS QR ERROR:", err);

    res.status(500).json({
      message: "Server error while generating QR",
    });
  }
};

module.exports = { applyLeave, getMyLeaves, getMyOutpasses, getOutpassQr };

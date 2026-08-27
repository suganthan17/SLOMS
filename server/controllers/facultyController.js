// server/controllers/facultyController.js
const Leave = require("../models/Leave");

// GET /api/faculty/leaves/pending
const getPendingLeaves = async (req, res) => {
  try {
    const leaves = await Leave.find({ status: "Pending" })
      .populate("student", "name registerNumber department year section photoUrl")
      .sort({ createdAt: -1 });

    res.status(200).json({ leaves });
  } catch (err) {
    console.error("GET PENDING LEAVES ERROR:", err);
    res.status(500).json({ message: "Server error while fetching pending leaves" });
  }
};

// PUT /api/faculty/leaves/:id/approve
const approveLeave = async (req, res) => {
  try {
    const leave = await Leave.findById(req.params.id);
    if (!leave) return res.status(404).json({ message: "Leave not found" });
    if (leave.status !== "Pending") {
      return res.status(400).json({ message: "Only pending leaves can be approved" });
    }

    leave.status = "Approved";
    leave.approvedBy = req.user._id;
    leave.remarks = req.body.remarks || "";
    leave.generateQrToken(); // issues the outpass QR at approval time

    await leave.save();

    res.status(200).json(leave);
  } catch (err) {
    console.error("APPROVE LEAVE ERROR:", err);
    res.status(500).json({ message: "Server error while approving leave" });
  }
};

// PUT /api/faculty/leaves/:id/reject
const rejectLeave = async (req, res) => {
  try {
    const leave = await Leave.findById(req.params.id);
    if (!leave) return res.status(404).json({ message: "Leave not found" });
    if (leave.status !== "Pending") {
      return res.status(400).json({ message: "Only pending leaves can be rejected" });
    }

    leave.status = "Rejected";
    leave.approvedBy = req.user._id;
    leave.remarks = req.body.remarks || "";

    await leave.save();

    res.status(200).json(leave);
  } catch (err) {
    console.error("REJECT LEAVE ERROR:", err);
    res.status(500).json({ message: "Server error while rejecting leave" });
  }
};

module.exports = { getPendingLeaves, approveLeave, rejectLeave };
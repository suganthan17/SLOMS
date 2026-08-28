const Leave = require("../models/Leave");
const User = require("../models/User");

// GET /api/faculty/leaves/pending
const getPendingLeaves = async (req, res) => {
  try {
    const facultyDepartment = req.user.department;

    if (!facultyDepartment) {
      return res.status(400).json({ message: "Faculty department is not set" });
    }

    const studentsInDept = await User.find({
      role: "Student",
      department: facultyDepartment,
    }).select("_id");

    const studentIds = studentsInDept.map((s) => s._id);

    const leaves = await Leave.find({
      status: "Pending",
      student: { $in: studentIds },
    })
      .populate(
        "student",
        "name registerNumber department year section photoUrl",
      )
      .sort({ createdAt: -1 });

    res.status(200).json({ leaves });
  } catch (err) {
    console.error("GET PENDING LEAVES ERROR:", err);
    res
      .status(500)
      .json({ message: "Server error while fetching pending leaves" });
  }
};

// PUT /api/faculty/leaves/:id/approve
const approveLeave = async (req, res) => {
  try {
    const leave = await Leave.findById(req.params.id).populate(
      "student",
      "department",
    );
    if (!leave) return res.status(404).json({ message: "Leave not found" });

    if (leave.student.department !== req.user.department) {
      return res
        .status(403)
        .json({
          message: "You can only approve leaves from your own department",
        });
    }

    if (leave.status !== "Pending") {
      return res
        .status(400)
        .json({ message: "Only pending leaves can be approved" });
    }

    leave.status = "Approved";
    leave.approvedBy = req.user._id;
    leave.remarks = req.body.remarks || "";
    leave.generateQrToken();

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
    const leave = await Leave.findById(req.params.id).populate(
      "student",
      "department",
    );
    if (!leave) return res.status(404).json({ message: "Leave not found" });

    if (leave.student.department !== req.user.department) {
      return res
        .status(403)
        .json({
          message: "You can only reject leaves from your own department",
        });
    }

    if (leave.status !== "Pending") {
      return res
        .status(400)
        .json({ message: "Only pending leaves can be rejected" });
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

// GET /api/faculty/leaves/history  (approved + rejected, same department only)
const getLeaveHistory = async (req, res) => {
  try {
    const facultyDepartment = req.user.department;

    if (!facultyDepartment) {
      return res.status(400).json({ message: "Faculty department is not set" });
    }

    const studentsInDept = await User.find({
      role: "Student",
      department: facultyDepartment,
    }).select("_id");

    const studentIds = studentsInDept.map((s) => s._id);

    const { status } = req.query;

    const filter = {
      status: { $in: ["Approved", "Rejected"] },
      student: { $in: studentIds },
    };

    if (status && status !== "All") {
      filter.status = status;
    }

    const leaves = await Leave.find(filter)
      .populate(
        "student",
        "name registerNumber department year section photoUrl",
      )
      .populate("approvedBy", "name")
      .sort({ updatedAt: -1 });

    res.status(200).json({ leaves });
  } catch (err) {
    console.error("GET LEAVE HISTORY ERROR:", err);
    res
      .status(500)
      .json({ message: "Server error while fetching leave history" });
  }
};

module.exports = {
  getPendingLeaves,
  approveLeave,
  rejectLeave,
  getLeaveHistory,
};

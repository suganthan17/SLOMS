const Leave = require("../models/Leave");

// POST /api/security/scan  — decode QR token, return student + leave info for visual verification
const scanQr = async (req, res) => {
  try {
    const { qrToken } = req.body;

    if (!qrToken) {
      return res.status(400).json({ message: "QR token is required" });
    }

    const leave = await Leave.findOne({ qrToken }).populate(
      "student",
      "name registerNumber department year section photoUrl phone",
    );

    if (!leave) {
      return res.status(404).json({ message: "Invalid or expired QR code" });
    }

    if (leave.outpassStatus === "Completed") {
      return res
        .status(400)
        .json({ message: "This outpass has already been completed" });
    }

    // Determine what action this scan represents
    const nextAction = leave.outpassStatus === "Active" ? "exit" : "entry";

    res.status(200).json({ leave, nextAction });
  } catch (err) {
    console.error("SCAN QR ERROR:", err);
    res.status(500).json({ message: "Server error while scanning QR" });
  }
};

// POST /api/security/scan/confirm-exit
const confirmExit = async (req, res) => {
  try {
    const { leaveId } = req.body;

    const leave = await Leave.findById(leaveId);
    if (!leave) return res.status(404).json({ message: "Outpass not found" });

    if (leave.outpassStatus !== "Active") {
      return res
        .status(400)
        .json({ message: "This outpass is not awaiting exit" });
    }

    leave.outpassStatus = "Outside";
    leave.exitTime = new Date();
    leave.exitScannedBy = req.user._id;

    await leave.save();

    res.status(200).json({ message: "Exit confirmed", leave });
  } catch (err) {
    console.error("CONFIRM EXIT ERROR:", err);
    res.status(500).json({ message: "Server error while confirming exit" });
  }
};

// POST /api/security/scan/confirm-entry
const confirmEntry = async (req, res) => {
  try {
    const { leaveId } = req.body;

    const leave = await Leave.findById(leaveId);
    if (!leave) return res.status(404).json({ message: "Outpass not found" });

    if (leave.outpassStatus !== "Outside") {
      return res
        .status(400)
        .json({ message: "This outpass is not awaiting entry" });
    }

    leave.outpassStatus = "Completed";
    leave.entryTime = new Date();
    leave.entryScannedBy = req.user._id;

    await leave.save();

    res
      .status(200)
      .json({ message: "Entry confirmed. Outpass completed.", leave });
  } catch (err) {
    console.error("CONFIRM ENTRY ERROR:", err);
    res.status(500).json({ message: "Server error while confirming entry" });
  }
};

// GET /api/security/outside  — students currently outside campus
const getStudentsOutside = async (req, res) => {
  try {
    const leaves = await Leave.find({ outpassStatus: "Outside" })
      .populate(
        "student",
        "name registerNumber department year section photoUrl",
      )
      .sort({ exitTime: -1 });

    res.status(200).json({ leaves });
  } catch (err) {
    console.error("GET STUDENTS OUTSIDE ERROR:", err);
    res
      .status(500)
      .json({ message: "Server error while fetching students outside" });
  }
};

module.exports = { scanQr, confirmExit, confirmEntry, getStudentsOutside };

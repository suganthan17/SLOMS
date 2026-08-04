const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    phone: { type: String, required: true },
    username: { type: String, required: true, unique: true, trim: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["Student", "Faculty", "Security"],
      required: true,
    },
    status: {
      type: String,
      enum: ["Active", "Inactive"],
      default: "Active",
    },
    photoUrl: { type: String, default: null },

    // Student fields
    registerNumber: { type: String },
    department: { type: String },
    year: { type: String },
    section: { type: String },

    // Faculty fields
    facultyId: { type: String },
    designation: { type: String },

    // Security fields
    employeeId: { type: String },
    shift: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
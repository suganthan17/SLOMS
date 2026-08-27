const mongoose = require("mongoose");
const crypto = require("crypto");

const leaveSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    reason: { type: String, required: true },
    fromDateTime: { type: Date, required: true },
    toDateTime: { type: Date, required: true },
    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
      default: "Pending",
    },
    remarks: { type: String, default: "" },
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    qrToken: { type: String, default: null, unique: true, sparse: true },
    outpassStatus: {
      type: String,
      enum: ["NotIssued", "Active", "Outside", "Completed"],
      default: "NotIssued",
    },
    exitTime: { type: Date, default: null },
    exitScannedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    entryTime: { type: Date, default: null },
    entryScannedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  { timestamps: true },
);

leaveSchema.methods.generateQrToken = function () {
  this.qrToken = crypto.randomBytes(24).toString("hex");
  this.outpassStatus = "Active";
  return this.qrToken;
};

module.exports = mongoose.model("Leave", leaveSchema);

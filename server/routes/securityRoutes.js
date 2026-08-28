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

router.use(protect, authorizeRoles("Security"));

router.post("/scan", scanQr);
router.post("/scan/confirm-exit", confirmExit);
router.post("/scan/confirm-entry", confirmEntry);
router.get("/outside", getStudentsOutside);

module.exports = router;
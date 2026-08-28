const express = require("express");
const router = express.Router();
const { applyLeave, getMyLeaves, getMyOutpasses, getOutpassQr } = require("../controllers/leaveController");
const protect = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

router.use(protect, authorizeRoles("Student"));

router.post("/", applyLeave);
router.get("/my", getMyLeaves);
router.get("/my/outpasses", getMyOutpasses);
router.get("/my/outpasses/:id/qr", getOutpassQr);

module.exports = router;
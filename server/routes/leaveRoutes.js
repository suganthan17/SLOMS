const express = require("express");
const router = express.Router();
const { applyLeave, getMyLeaves, getMyOutpasses } = require("../controllers/leaveController");
const protect = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

router.use(protect, authorizeRoles("Student"));

router.post("/", applyLeave);
router.get("/my", getMyLeaves);
router.get("/my/outpasses", getMyOutpasses);

module.exports = router;
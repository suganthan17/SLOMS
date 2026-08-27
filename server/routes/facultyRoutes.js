// server/routes/facultyRoutes.js
const express = require("express");
const router = express.Router();
const { getPendingLeaves, approveLeave, rejectLeave } = require("../controllers/facultyController");
const protect = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

router.use(protect, authorizeRoles("Faculty"));

router.get("/leaves/pending", getPendingLeaves);
router.put("/leaves/:id/approve", approveLeave);
router.put("/leaves/:id/reject", rejectLeave);

module.exports = router;
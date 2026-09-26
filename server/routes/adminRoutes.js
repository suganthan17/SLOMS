const express = require("express");

const router = express.Router();

const { getDashboardStats } = require("../controllers/adminController");

const protect = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

router.use(protect, authorizeRoles("Admin"));

router.get("/dashboard", getDashboardStats);

module.exports = router;
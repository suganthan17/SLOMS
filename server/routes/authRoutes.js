const express = require("express");

const router = express.Router();

const {
  loginUser,
  logoutUser,
  getMe,
  changePassword,
} = require("../controllers/authController");

const protect = require("../middleware/authMiddleware");

router.post("/login", loginUser);

router.post("/logout", logoutUser);

router.get("/me", protect, getMe);

router.put("/change-password", protect, changePassword);

module.exports = router;
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const generateToken = require("../utils/generateToken");

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    const user = await User.findOne({
      email: email.toLowerCase().trim(),
    });

    if (!user) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }

    if (user.status === "Inactive") {
      return res.status(403).json({
        message: "Account is inactive. Contact admin.",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }

    generateToken(res, user._id, user.role);

    const { password: _, ...userData } = user.toObject();

    res.status(200).json(userData);
  } catch (err) {
    console.error("LOGIN ERROR:", err);

    res.status(500).json({
      message: "Server error during login",
    });
  }
};

const logoutUser = (req, res) => {
  res.clearCookie("token");
  res.status(200).json({
    message: "Logged out successfully",
  });
};

const getMe = async (req, res) => {
  res.status(200).json(req.user);
};

module.exports = {
  loginUser,
  logoutUser,
  getMe,
};

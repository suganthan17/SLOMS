const bcrypt = require("bcryptjs");
const User = require("../models/User");

// POST /api/users  (admin only)
const createUser = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      role,
      username,
      password,
      registerNumber,
      department,
      year,
      section,
      facultyId,
      designation,
      employeeId,
      shift,
    } = req.body;

    if (!name || !email || !phone || !role || !username || !password) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const existing = await User.findOne({ $or: [{ email }, { username }] });
    if (existing) {
      return res
        .status(409)
        .json({ message: "Email or username already in use" });
    }

    const roleFieldMap = {
      Student: { registerNumber, department, year, section },
      Faculty: { facultyId, department, designation },
      Security: { employeeId, shift },
    };

    const roleFields = roleFieldMap[role];
    if (!roleFields) {
      return res.status(400).json({ message: "Invalid role" });
    }

    for (const [key, value] of Object.entries(roleFields)) {
      if (!value) {
        return res
          .status(400)
          .json({ message: `${key} is required for ${role}` });
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      email,
      phone,
      role,
      username,
      password: hashedPassword,
      status: "Active",
      photoUrl: req.file ? req.file.path : null,
      ...roleFields,
    });

    const { password: _, ...userResponse } = newUser.toObject();
    res.status(201).json(userResponse);
  } catch (err) {
    console.error("CREATE USER ERROR:", err); // <-- confirm this exists
    res.status(500).json({ message: "Server error while creating user" });
  }
};

// GET /api/users
const getUsers = async (req, res) => {
  try {
    const {
      search,
      role,
      department,
      status,
      page = 1,
      limit = 10,
    } = req.query;

    const filter = {};

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { username: { $regex: search, $options: "i" } },
        { registerNumber: { $regex: search, $options: "i" } },
        { facultyId: { $regex: search, $options: "i" } },
        { employeeId: { $regex: search, $options: "i" } },
      ];
    }

    if (role && role !== "All Roles") filter.role = role;
    if (department && department !== "All Departments")
      filter.department = department;
    if (status && status !== "All Status") filter.status = status;

    const skip = (Number(page) - 1) * Number(limit);

    const [users, total] = await Promise.all([
      User.find(filter)
        .select("-password")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      User.countDocuments(filter),
    ]);

    res
      .status(200)
      .json({ users, total, page: Number(page), limit: Number(limit) });
  } catch (err) {
    console.error("GET USERS ERROR:", err);
    res.status(500).json({ message: "Server error while fetching users" });
  }
};

// GET /api/users/:id
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json(user);
  } catch (err) {
    console.error("GET USER BY ID ERROR:", err);
    res.status(500).json({ message: "Server error while fetching user" });
  }
};

// PUT /api/users/:id
const updateUser = async (req, res) => {
  try {
    const updates = { ...req.body };

    if (updates.password) {
      updates.password = await bcrypt.hash(updates.password, 10);
    } else {
      delete updates.password;
    }

    if (req.file) {
      updates.photoUrl = req.file.path;
    }

    const user = await User.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    }).select("-password");

    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json(user);
  } catch (err) {
    console.error("UPDATE USER ERROR:", err);
    res.status(500).json({ message: "Server error while updating user" });
  }
};

// DELETE /api/users/:id
const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json({ message: "User deleted successfully" });
  } catch (err) {
    console.error("DELETE USER ERROR:", err);
    res.status(500).json({ message: "Server error while deleting user" });
  }
};

module.exports = { createUser, getUsers, getUserById, updateUser, deleteUser };

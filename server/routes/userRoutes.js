const express = require("express");

const router = express.Router();

const {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  importStudents,
} = require("../controllers/userController");

const protect = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");
const upload = require("../middleware/uploadMiddleware");

router.use(
  protect,
  authorizeRoles("Admin")
);

router.post(
  "/",
  upload.single("photo"),
  createUser
);

router.post(
  "/import-students",
  importStudents
);

router.get(
  "/",
  getUsers
);

router.get(
  "/:id",
  getUserById
);

router.put(
  "/:id",
  upload.single("photo"),
  updateUser
);

router.delete(
  "/:id",
  deleteUser
);

module.exports = router;
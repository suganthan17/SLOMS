const bcrypt = require("bcryptjs");
const User = require("../models/User");

const createUser = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      role,
      password,
      registerNumber,
      department,
      year,
      parentName,
      parentPhone,
      facultyId,
      designation,
      employeeId,
      shift,
      assignedFaculty,
    } = req.body;

    if (!name || !email || !phone || !role || !password) {
      return res.status(400).json({
        message: "Missing required fields",
      });
    }

    const existing = await User.findOne({
      email: email.toLowerCase().trim(),
    });

    if (existing) {
      return res.status(409).json({
        message: "Email already in use",
      });
    }

    const roleFieldMap = {
      Student: {
        registerNumber,
        department,
        year,
        parentName,
        parentPhone,
        assignedFaculty,
      },
      Faculty: {
        facultyId,
        department,
        designation,
      },
      Security: {
        employeeId,
        shift,
      },
    };

    const roleFields = roleFieldMap[role];

    if (!roleFields) {
      return res.status(400).json({
        message: "Invalid role",
      });
    }

    for (const [key, value] of Object.entries(roleFields)) {
      if (!value) {
        return res.status(400).json({
          message: `${key} is required for ${role}`,
        });
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      phone: phone.trim(),
      role,
      password: hashedPassword,
      status: "Active",
      photoUrl: req.file ? req.file.path : null,
      ...roleFields,
    });

    const { password: _, ...userResponse } =
      newUser.toObject();

    res.status(201).json(userResponse);
  } catch (err) {
    console.error("CREATE USER ERROR:", err);

    res.status(500).json({
      message: "Server error while creating user",
    });
  }
};

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
        {
          registerNumber: {
            $regex: search,
            $options: "i",
          },
        },
        {
          facultyId: {
            $regex: search,
            $options: "i",
          },
        },
        {
          employeeId: {
            $regex: search,
            $options: "i",
          },
        },
      ];
    }

    if (role && role !== "All Roles") {
      filter.role = role;
    }

    if (department && department !== "All Departments") {
      filter.department = department;
    }

    if (status && status !== "All Status") {
      filter.status = status;
    }

    const skip =
      (Number(page) - 1) * Number(limit);

    const [users, total] = await Promise.all([
      User.find(filter)
        .select("-password")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),

      User.countDocuments(filter),
    ]);

    res.status(200).json({
      users,
      total,
      page: Number(page),
      limit: Number(limit),
    });
  } catch (err) {
    console.error("GET USERS ERROR:", err);

    res.status(500).json({
      message: "Server error while fetching users",
    });
  }
};

const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select("-password")
      .populate(
        "assignedFaculty",
        "name email phone designation facultyId photoUrl"
      );

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.status(200).json(user);
  } catch (err) {
    console.error("GET USER BY ID ERROR:", err);

    res.status(500).json({
      message: "Server error while fetching user",
    });
  }
};

const updateUser = async (req, res) => {
  try {
    const updates = { ...req.body };

    if (updates.email) {
      updates.email = updates.email.toLowerCase().trim();
    }

    if (updates.password) {
      updates.password = await bcrypt.hash(
        updates.password,
        10
      );
    } else {
      delete updates.password;
    }

    if (req.file) {
      updates.photoUrl = req.file.path;
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      updates,
      {
        new: true,
        runValidators: true,
      }
    )
      .select("-password")
      .populate(
        "assignedFaculty",
        "name email phone designation facultyId photoUrl"
      );

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.status(200).json(user);
  } catch (err) {
    console.error("UPDATE USER ERROR:", err);

    res.status(500).json({
      message: "Server error while updating user",
    });
  }
};

const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(
      req.params.id
    );

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.status(200).json({
      message: "User deleted successfully",
    });
  } catch (err) {
    console.error("DELETE USER ERROR:", err);

    res.status(500).json({
      message: "Server error while deleting user",
    });
  }
};

const importStudents = async (req, res) => {
  try {
    const { students } = req.body;

    if (!Array.isArray(students) || students.length === 0) {
      return res.status(400).json({
        message: "No students were provided for import",
      });
    }

    const errors = [];
    const preparedStudents = [];

    const emailsInFile = new Set();
    const registerNumbersInFile = new Set();

    const facultyAssignments = {};

    for (let index = 0; index < students.length; index++) {
      const student = students[index];

      const rowNumber = index + 2;

      const {
        name,
        email,
        phone,
        password,
        registerNumber,
        department,
        year,
        parentName,
        parentPhone,
      } = student;

      if (
        !name ||
        !email ||
        !phone ||
        !password ||
        !registerNumber ||
        !department ||
        !year ||
        !parentName ||
        !parentPhone
      ) {
        errors.push(
          `Row ${rowNumber}: Missing required field.`
        );

        continue;
      }

      const normalizedName = String(name).trim();

      const normalizedEmail = String(email)
        .trim()
        .toLowerCase();

      const normalizedPhone =
        String(phone).trim();

      const normalizedPassword =
        String(password);

      const normalizedRegisterNumber =
        String(registerNumber).trim();

      const normalizedDepartment =
        String(department).trim();

      const normalizedYear =
        String(year).trim();

      const normalizedParentName =
        String(parentName).trim();

      const normalizedParentPhone =
        String(parentPhone).trim();

      if (emailsInFile.has(normalizedEmail)) {
        errors.push(
          `Row ${rowNumber}: Duplicate email ${normalizedEmail} in the file.`
        );

        continue;
      }

      if (
        registerNumbersInFile.has(
          normalizedRegisterNumber
        )
      ) {
        errors.push(
          `Row ${rowNumber}: Duplicate register number ${normalizedRegisterNumber} in the file.`
        );

        continue;
      }

      emailsInFile.add(normalizedEmail);

      registerNumbersInFile.add(
        normalizedRegisterNumber
      );

      const existingEmail =
        await User.findOne({
          email: normalizedEmail,
        });

      if (existingEmail) {
        errors.push(
          `Row ${rowNumber}: Email ${normalizedEmail} already exists.`
        );

        continue;
      }

      const existingRegisterNumber =
        await User.findOne({
          registerNumber:
            normalizedRegisterNumber,
        });

      if (existingRegisterNumber) {
        errors.push(
          `Row ${rowNumber}: Register number ${normalizedRegisterNumber} already exists.`
        );

        continue;
      }

      if (
        !facultyAssignments[
          normalizedDepartment
        ]
      ) {
        const faculties = await User.find({
          role: "Faculty",
          status: "Active",
          department:
            normalizedDepartment,
        })
          .select(
            "_id name facultyId department"
          )
          .sort({ createdAt: 1 });

        if (!faculties.length) {
          errors.push(
            `Row ${rowNumber}: No active faculty found in department ${normalizedDepartment}.`
          );

          continue;
        }

        facultyAssignments[
          normalizedDepartment
        ] = {
          faculties,
          currentIndex: 0,
        };
      }

      const departmentData =
        facultyAssignments[
          normalizedDepartment
        ];

      const faculty =
        departmentData.faculties[
          departmentData.currentIndex %
            departmentData.faculties.length
        ];

      departmentData.currentIndex += 1;

      preparedStudents.push({
        name: normalizedName,
        email: normalizedEmail,
        phone: normalizedPhone,
        password: normalizedPassword,
        role: "Student",
        status: "Active",
        photoUrl: null,
        registerNumber:
          normalizedRegisterNumber,
        department:
          normalizedDepartment,
        year: normalizedYear,
        parentName:
          normalizedParentName,
        parentPhone:
          normalizedParentPhone,
        assignedFaculty:
          faculty._id,
      });
    }

    if (errors.length > 0) {
      return res.status(400).json({
        message:
          "Please fix the errors before importing.",
        errors,
      });
    }

    const studentsToCreate = [];

    for (const student of preparedStudents) {
      const hashedPassword =
        await bcrypt.hash(
          student.password,
          10
        );

      studentsToCreate.push({
        ...student,
        password: hashedPassword,
      });
    }

    const createdStudents =
      await User.insertMany(
        studentsToCreate
      );

    res.status(201).json({
      message:
        "Students imported successfully",
      imported:
        createdStudents.length,
    });
  } catch (err) {
    console.error(
      "IMPORT STUDENTS ERROR:",
      err
    );

    res.status(500).json({
      message:
        "Server error while importing students",
    });
  }
};

module.exports = {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  importStudents,
};
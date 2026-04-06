const { User } = require("../models");

exports.createUser = async (req, res) => {
  try {
    let { name, email, password, role } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ message: "Name is required" });
    }

    if (!email || !email.trim()) {
      return res.status(400).json({ message: "Email is required" });
    }

    if (!password || password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    const allowedRoles = ["user", "supervisor", "manager", "admin"];

    if (!role || !allowedRoles.includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    name = name.trim();
    email = email.trim().toLowerCase();

    const existingUser = await User.findOne({
      where: { email },
    });

    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const user = await User.create({
      name,
      email,
      password,
      role,
      isActive: true,
    });

    return res.status(201).json({
      message: "User created successfully",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        isActive: user.isActive,
      },
    });
  } catch (error) {
    console.error("createUser error:", error);
    return res.status(500).json({ message: "Error creating user" });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ["id", "name", "email", "role", "isActive", "createdAt"],
      order: [["name", "ASC"]],
    });

    return res.json(users);
  } catch (error) {
    console.error("getAllUsers error:", error);
    return res.status(500).json({ message: "Error fetching users" });
  }
};
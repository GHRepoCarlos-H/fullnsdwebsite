const { User } = require("../models");

async function createAdmin() {
  try {
    const user = await User.create({
      name: "Admin User",
      email: "admin@test.com",
      password: "password123",
      role: "admin",
      isActive: true,
    });

    console.log("Admin created:", user.email);
  } catch (error) {
    console.error(error);
  }
}

createAdmin();
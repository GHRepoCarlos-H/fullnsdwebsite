const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const authenticateUser = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

router.post(
  "/",
  authenticateUser,
  authorizeRoles("admin"),
  userController.createUser
);

router.get(
  "/",
  authenticateUser,
  authorizeRoles("admin"),
  userController.getAllUsers
);

module.exports = router;
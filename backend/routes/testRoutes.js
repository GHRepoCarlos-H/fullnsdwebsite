const express = require("express");
const router = express.Router();
const authenticateUser = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

router.get("/me", authenticateUser, (req, res) => {
  res.json({
    message: "Protected route works",
    user: req.user,
  });
});

router.get(
  "/admin-only",
  authenticateUser,
  authorizeRoles("admin"),
  (req, res) => {
    res.json({
      message: "Welcome, admin",
    });
  }
);

router.get(
  "/leadership",
  authenticateUser,
  authorizeRoles("supervisor", "manager", "admin"),
  (req, res) => {
    res.json({
      message: "Leadership access granted",
    });
  }
);

module.exports = router;
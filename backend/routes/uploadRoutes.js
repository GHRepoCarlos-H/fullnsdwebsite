const express = require("express");
const router = express.Router();
const uploadController = require("../controllers/uploadController");
const authenticateUser = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");
const upload = require("../middleware/uploadMiddleware");

router.post(
  "/",
  authenticateUser,
  authorizeRoles("supervisor", "manager", "admin"),
  upload.single("image"),
  uploadController.uploadImage
);

module.exports = router;
const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");
const authenticateUser = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

router.get("/", authenticateUser, productController.getAllProducts);

router.get("/:id", authenticateUser, productController.getProductById);

router.post(
  "/",
  authenticateUser,
  authorizeRoles("supervisor", "manager", "admin"),
  productController.createProduct
);

router.put(
  "/:id",
  authenticateUser,
  authorizeRoles("supervisor", "manager", "admin"),
  productController.updateProduct
);

router.delete(
  "/:id",
  authenticateUser,
  authorizeRoles("manager", "admin"),
  productController.softDeleteProduct
);

module.exports = router;
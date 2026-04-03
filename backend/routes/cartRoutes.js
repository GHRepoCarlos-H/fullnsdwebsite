const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cartController");
const authenticateUser = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

router.post("/", authenticateUser, cartController.createCart);

router.get("/my", authenticateUser, cartController.getMyCarts);

router.get(
  "/",
  authenticateUser,
  authorizeRoles("supervisor", "manager", "admin"),
  cartController.getAllCartsForLeadership
);

router.get("/:id", authenticateUser, cartController.getCartById);

router.post("/:id/items", authenticateUser, cartController.addItemToCart);

router.put(
  "/:cartId/items/:itemId",
  authenticateUser,
  cartController.updateCartItem
);

router.delete(
  "/:cartId/items/:itemId",
  authenticateUser,
  cartController.removeCartItem
);

router.put("/:id/submit", authenticateUser, cartController.submitCart);


router.put(
  "/:id/status",
  authenticateUser,
  authorizeRoles("supervisor", "manager", "admin"),
  cartController.updateCartStatus
);


module.exports = router;
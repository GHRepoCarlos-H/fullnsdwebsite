const { Op } = require("sequelize");
const { Cart, CartItem, Product, User } = require("../models");

exports.createCart = async (req, res) => {
  try {
    let { title, notes } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ message: "Cart title is required" });
    }

    title = title.trim();
    notes = notes ? notes.trim() : null;

    const cart = await Cart.create({
      userId: req.user.id,
      title,
      notes,
      status: "draft",
    });

    res.status(201).json(cart);
  } catch (error) {
    console.error("createCart error:", error);
    res.status(500).json({ message: "Error creating cart" });
  }
};

exports.getMyCarts = async (req, res) => {
  try {
    const carts = await Cart.findAll({
      where: { userId: req.user.id },
      include: [
        {
          model: CartItem,
          as: "items",
          include: [
            {
              model: Product,
              as: "product",
            },
          ],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    res.json(carts);
  } catch (error) {
    console.error("getMyCarts error:", error);
    res.status(500).json({ message: "Error fetching your carts" });
  }
};

exports.addItemToCart = async (req, res) => {
  try {
    const cartId = Number(req.params.id);
    const { productId, quantity } = req.body;

    if (!Number.isInteger(productId) || !Number.isInteger(quantity) || quantity < 1) {
      return res.status(400).json({
        message: "productId and quantity must be whole numbers, and quantity must be at least 1",
      });
    }

    const cart = await Cart.findByPk(cartId);

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    if (cart.userId !== req.user.id) {
      return res.status(403).json({ message: "You can only edit your own carts" });
    }

    if (cart.status !== "draft") {
      return res.status(400).json({ message: "Only draft carts can be edited" });
    }

    const product = await Product.findByPk(productId);

    if (!product || !product.isActive) {
      return res.status(404).json({ message: "Active product not found" });
    }

    const existingItem = await CartItem.findOne({
      where: { cartId, productId },
    });

    if (existingItem) {
      await existingItem.update({
        quantity: existingItem.quantity + quantity,
      });

      return res.json(existingItem);
    }

    const cartItem = await CartItem.create({
      cartId,
      productId,
      quantity,
    });

    res.status(201).json(cartItem);
  } catch (error) {
    console.error("addItemToCart error:", error);
    res.status(500).json({ message: "Error adding item to cart" });
  }
};

exports.submitCart = async (req, res) => {
  try {
    const cartId = Number(req.params.id);

    const cart = await Cart.findByPk(cartId);

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    if (cart.userId !== req.user.id) {
      return res.status(403).json({ message: "You can only submit your own carts" });
    }

    if (cart.status !== "draft") {
      return res.status(400).json({ message: "Only draft carts can be submitted" });
    }

    const items = await CartItem.findAll({
      where: { cartId },
    });

    if (items.length === 0) {
      return res.status(400).json({ message: "Cannot submit an empty cart" });
    }

    await cart.update({ status: "submitted" });

    res.json({
      message: "Cart submitted successfully",
      cart,
    });
  } catch (error) {
    console.error("submitCart error:", error);
    res.status(500).json({ message: "Error submitting cart" });
  }
};

exports.getCartById = async (req, res) => {
  try {
    const cartId = Number(req.params.id);

    const cart = await Cart.findByPk(cartId, {
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "name", "email", "role"],
        },
        {
          model: CartItem,
          as: "items",
          include: [
            {
              model: Product,
              as: "product",
            },
          ],
        },
      ],
    });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const isOwner = cart.userId === req.user.id;
    const isLeadership = ["supervisor", "manager", "admin"].includes(req.user.role);

    if (!isOwner && !isLeadership) {
      return res.status(403).json({ message: "You do not have access to this cart" });
    }

    if (isLeadership && cart.status === "draft" && !isOwner) {
      return res.status(403).json({ message: "Leadership cannot view draft carts they do not own" });
    }

    res.json(cart);
  } catch (error) {
    console.error("getCartById error:", error);
    res.status(500).json({ message: "Error fetching cart" });
  }
};

exports.getAllCartsForLeadership = async (req, res) => {
  try {
    const carts = await Cart.findAll({
      where: {
        status: {
          [Op.in]: ["submitted", "reviewed", "completed"],
        },
      },
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "name", "email", "role"],
        },
        {
          model: CartItem,
          as: "items",
          include: [
            {
              model: Product,
              as: "product",
            },
          ],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    res.json(carts);
  } catch (error) {
    console.error("getAllCartsForLeadership error:", error);
    res.status(500).json({ message: "Error fetching carts" });
  }
};

exports.updateCartStatus = async (req, res) => {
  try {
    const cartId = Number(req.params.id);
    const { status } = req.body;

    const cart = await Cart.findByPk(cartId);

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    if (status === "reviewed") {
      if (cart.status !== "submitted") {
        return res.status(400).json({
          message: "Only submitted carts can be marked as reviewed",
        });
      }
    } else if (status === "completed") {
      if (cart.status !== "reviewed") {
        return res.status(400).json({
          message: "Only reviewed carts can be marked as completed",
        });
      }
    } else {
      return res.status(400).json({
        message: "Status must be reviewed or completed",
      });
    }

    await cart.update({ status });

    res.json({
      message: "Cart status updated successfully",
      cart,
    });
  } catch (error) {
    console.error("updateCartStatus error:", error);
    res.status(500).json({ message: "Error updating cart status" });
  }
};

exports.updateCartItem = async (req, res) => {
  try {
    const cartId = Number(req.params.cartId);
    const itemId = Number(req.params.itemId);
    const { quantity } = req.body;

    if (!quantity || quantity < 1) {
      return res.status(400).json({
        message: "Quantity must be at least 1",
      });
    }

    const cart = await Cart.findByPk(cartId);

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    if (cart.userId !== req.user.id) {
      return res.status(403).json({
        message: "You can only edit your own carts",
      });
    }

    if (cart.status !== "draft") {
      return res.status(400).json({
        message: "Only draft carts can be edited",
      });
    }

    const cartItem = await CartItem.findOne({
      where: {
        id: itemId,
        cartId,
      },
      include: [
        {
          model: Product,
          as: "product",
        },
      ],
    });

    if (!cartItem) {
      return res.status(404).json({ message: "Cart item not found" });
    }

    await cartItem.update({ quantity });

    res.json({
      message: "Cart item updated successfully",
      cartItem,
    });
  } catch (error) {
    console.error("updateCartItem error:", error);
    res.status(500).json({ message: "Error updating cart item" });
  }
};

exports.removeCartItem = async (req, res) => {
  try {
    const cartId = Number(req.params.cartId);
    const itemId = Number(req.params.itemId);

    const cart = await Cart.findByPk(cartId);

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    if (cart.userId !== req.user.id) {
      return res.status(403).json({
        message: "You can only edit your own carts",
      });
    }

    if (cart.status !== "draft") {
      return res.status(400).json({
        message: "Only draft carts can be edited",
      });
    }

    const cartItem = await CartItem.findOne({
      where: {
        id: itemId,
        cartId,
      },
    });

    if (!cartItem) {
      return res.status(404).json({ message: "Cart item not found" });
    }

    await cartItem.destroy();

    res.json({
      message: "Cart item removed successfully",
    });
  } catch (error) {
    console.error("removeCartItem error:", error);
    res.status(500).json({ message: "Error removing cart item" });
  }
};
const { Product } = require("../models");

exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.findAll({
      where: { isActive: true },
      order: [["id", "ASC"]],
    });

    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching products" });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);

    if (!product || !product.isActive) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching product" });
  }
};

exports.createProduct = async (req, res) => {
  try {
    const {
      image,
      us,
      stockNumber,
      description,
      uom,
      pkgSize,
      vendorPartNumber,
      category,
    } = req.body;

    const existingProduct = await Product.findOne({
      where: { stockNumber },
    });

    if (existingProduct) {
      return res.status(400).json({ message: "Stock number already exists" });
    }

    const product = await Product.create({
      image,
      us,
      stockNumber,
      description,
      uom,
      pkgSize,
      vendorPartNumber,
      category,
      isActive: true,
    });

    res.status(201).json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error creating product" });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);

    if (!product || !product.isActive) {
      return res.status(404).json({ message: "Product not found" });
    }

    const {
      image,
      us,
      stockNumber,
      description,
      uom,
      pkgSize,
      vendorPartNumber,
      category,
    } = req.body;

    if (stockNumber && stockNumber !== product.stockNumber) {
      const existingProduct = await Product.findOne({
        where: { stockNumber },
      });

      if (existingProduct) {
        return res.status(400).json({ message: "Stock number already exists" });
      }
    }

    await product.update({
      image,
      us,
      stockNumber,
      description,
      uom,
      pkgSize,
      vendorPartNumber,
      category,
    });

    res.json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating product" });
  }
};

exports.softDeleteProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);

    if (!product || !product.isActive) {
      return res.status(404).json({ message: "Product not found" });
    }

    await product.update({ isActive: false });

    res.json({ message: "Product deactivated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error deleting product" });
  }
};
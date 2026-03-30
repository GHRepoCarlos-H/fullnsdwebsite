"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    static associate(models) {
      Product.hasMany(models.CartItem, {
        foreignKey: "productId",
        as: "cartItems",
      });
    }
  }

  Product.init(
    {
      image: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      us: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      stockNumber: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      description: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      uom: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      pkgSize: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      vendorPartNumber: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      category: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
    },
    {
      sequelize,
      modelName: "Product",
    }
  );

  return Product;
};
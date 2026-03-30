"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Cart extends Model {
    static associate(models) {
      Cart.belongsTo(models.User, {
        foreignKey: "userId",
        as: "user",
      });

      Cart.hasMany(models.CartItem, {
        foreignKey: "cartId",
        as: "items",
      });
    }
  }

  Cart.init(
    {
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      notes: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      status: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "draft",
        validate: {
          isIn: [["draft", "submitted", "reviewed", "completed"]],
        },
      },
    },
    {
      sequelize,
      modelName: "Cart",
    }
  );

  return Cart;
};
"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Order.belongsTo(models.User, {
        foreignKey: {
          name: "userId",
        },
      });
      Order.hasMany(models.ServicesOrdered, {
        foreignKey: {
          name: "orderId",
        },
        onDelete: "CASCADE",
      });

      Order.belongsToMany(models.Service, {
        through: models.ServicesOrdered,
        foreignKey: {
          name: "orderId",
        },
      });
    }
  }
  Order.init(
    {
      userId: DataTypes.INTEGER,
      totalPrice: DataTypes.INTEGER,
      location: DataTypes.STRING,
      status: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Order",
    }
  );
  return Order;
};

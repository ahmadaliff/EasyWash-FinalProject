"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Service extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Service.belongsTo(models.Merchant, {
        foreignKey: {
          name: "merchantId",
        },
      });
      Service.hasMany(models.ServicesOrdered, {
        foreignKey: { name: "serviceId" },
        onDelete: "CASCADE",
      });
      Service.hasMany(models.Cart, {
        foreignKey: { name: "serviceId" },
        onDelete: "CASCADE",
      });

      Service.belongsToMany(models.Order, {
        through: models.ServicesOrdered,
        foreignKey: { name: "serviceId" },
      });
    }
  }
  Service.init(
    {
      name: DataTypes.STRING,
      price: DataTypes.INTEGER,
      merchantId: DataTypes.INTEGER,
      isUnit: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "Service",
    }
  );
  return Service;
};

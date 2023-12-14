"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class ServicesOrdered extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      ServicesOrdered.belongsTo(models.Order, {
        foreignKey: {
          name: "orderId",
        },
      });
      ServicesOrdered.belongsTo(models.Service, {
        foreignKey: {
          name: "serviceId",
        },
      });
    }
  }
  ServicesOrdered.init(
    {
      orderId: DataTypes.STRING,
      serviceId: DataTypes.INTEGER,
      quantity: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "ServicesOrdered",
    }
  );
  return ServicesOrdered;
};

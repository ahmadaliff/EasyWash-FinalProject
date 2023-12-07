"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Merchant extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Merchant.belongsTo(models.User, {
        foreignKey: {
          name: "userId",
        },
        onDelete: "CASCADE",
      });
    }
  }
  Merchant.init(
    {
      name: DataTypes.STRING,
      description: DataTypes.STRING,
      imagePath: DataTypes.STRING,
      userId: DataTypes.INTEGER,
      location: DataTypes.STRING,
      isVerified: DataTypes.BOOLEAN,
    },
    {
      hooks: {
        beforeCreate: (merchant) => {
          merchant.isVerified = false;
        },
      },
      sequelize,
      modelName: "Merchant",
    }
  );
  return Merchant;
};

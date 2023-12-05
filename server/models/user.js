"use strict";
const { Model } = require("sequelize");

const { hashPassword } = require("../utils/bcryptUtil");

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {}
  }
  User.init(
    {
      fullName: DataTypes.STRING,
      email: DataTypes.STRING,
      phone: DataTypes.STRING,
      password: DataTypes.STRING,
      role: DataTypes.STRING,
      isVerify: DataTypes.BOOLEAN,
      imagePath: DataTypes.STRING,
    },
    {
      hooks: {
        beforeCreate: (user) => {
          user.password = hashPassword(user.password);
          user.role === "laundry"
            ? (user.isVerify = false)
            : (user.isVerify = true);
        },
      },
      sequelize,
      modelName: "User",
    }
  );
  return User;
};

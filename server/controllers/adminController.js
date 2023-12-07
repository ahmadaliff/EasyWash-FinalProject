require("dotenv").config();

const { Op } = require("sequelize");
const {
  handleSuccess,
  handleServerError,
  handleNotFound,
} = require("../helpers/handleResponseHelper");

const { User, Merchant, sequelize } = require("../models");

exports.getUsers = async (req, res) => {
  try {
    const { id } = req;
    const page = parseInt(req.query.page) || 0;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || "";
    const offset = limit * page;
    const totalRows = await User.count({
      where: {
        id: { [Op.ne]: id },
        isVerified: true,
        [Op.or]: [
          {
            fullName: {
              [Op.like]: "%" + search + "%",
            },
          },
          {
            email: {
              [Op.like]: "%" + search + "%",
            },
          },
        ],
      },
    });
    const totalPage = Math.ceil(totalRows / limit);
    const response = await User.findAll({
      where: {
        id: { [Op.ne]: id },
        isVerified: true,
        [Op.or]: [
          {
            fullName: {
              [Op.like]: "%" + search + "%",
            },
          },
          {
            email: {
              [Op.like]: "%" + search + "%",
            },
          },
        ],
      },
      offset: offset,
      limit: limit,
    });
    if (!response) {
      return handleNotFound(res);
    }
    response.map(({ dataValues }) => {
      delete dataValues.password;
      return dataValues;
    });
    return handleSuccess(res, {
      data: response,
      totalPage: totalPage,
      totalRows: totalRows,
    });
  } catch (error) {
    return handleServerError(res);
  }
};

exports.getUnverifiedUsers = async (req, res) => {
  try {
    const { id } = req;
    const page = parseInt(req.query.page) || 0;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || "";
    const offset = limit * page;
    const totalRows = await User.count({
      where: {
        id: { [Op.ne]: id },
        isVerified: false,
        [Op.or]: [
          {
            fullName: {
              [Op.like]: "%" + search + "%",
            },
          },
          {
            email: {
              [Op.like]: "%" + search + "%",
            },
          },
        ],
      },
    });
    const totalPage = Math.ceil(totalRows / limit);
    const response = await User.findAll({
      where: {
        id: { [Op.ne]: id },
        isVerified: false,
        [Op.or]: [
          {
            fullName: {
              [Op.like]: "%" + search + "%",
            },
          },
          {
            email: {
              [Op.like]: "%" + search + "%",
            },
          },
        ],
      },
      offset: offset,
      limit: limit,
    });
    if (!response) {
      return handleNotFound(res);
    }
    response.map(({ dataValues }) => {
      delete dataValues.password;
      return dataValues;
    });
    return handleSuccess(res, {
      data: response,
      totalPage: totalPage,
      totalRows: totalRows,
    });
  } catch (error) {
    return handleServerError(res);
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.body;
    const isExist = await User.findByPk(id);
    if (!isExist) {
      return handleNotFound(res);
    }
    await User.destroy({ where: { id: id } });
    return handleSuccess(res, {
      message: isExist.dataValues.isVerified
        ? "app_user_deleted"
        : "app_user_decline",
    });
  } catch (error) {
    return handleServerError(res);
  }
};

exports.verifyUser = async (req, res) => {
  try {
    const { id } = req.body;
    const isExist = await User.findByPk(id);
    if (!isExist) {
      return handleNotFound(res);
    }
    await sequelize.transaction(async (t) => {
      await User.update(
        { isVerified: true },
        { where: { id: id }, transaction: t }
      );
      await Merchant.update(
        { isVerified: true },
        { where: { userId: id }, transaction: t }
      );
    });
    return handleSuccess(res, { message: "app_account_verified" });
  } catch (error) {
    return handleServerError(res);
  }
};

require("dotenv").config();

const { Op } = require("sequelize");
const {
  handleSuccess,
  handleServerError,
  handleNotFound,
} = require("../helpers/handleResponseHelper");

const { User } = require("../models");

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
        isVerify: true,
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
        isVerify: true,
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
    console.log(error);
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
        isVerify: false,
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
        isVerify: false,
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
    console.log(error);
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
    return handleSuccess(res, { message: "app_user_deleted" });
  } catch (error) {
    console.log(error);
    return handleServerError(res);
  }
};

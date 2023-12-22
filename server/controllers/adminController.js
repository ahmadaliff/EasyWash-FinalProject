require("dotenv").config();

const { Op } = require("sequelize");
const {
  handleSuccess,
  handleServerError,
  handleNotFound,
} = require("../helpers/handleResponseHelper");

const { chatStreamClient } = require("../utils/streamChatUtil");

const { User, Merchant, sequelize } = require("../models");

exports.getUsers = async (req, res) => {
  try {
    const { id } = req;
    const page = parseInt(req.query.page) || 0;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || "";
    const offset = limit * page;
    const response = await User.findAndCountAll({
      where: {
        id: { [Op.ne]: id },
        [Op.or]: [
          {
            fullName: {
              [Op.like]: `%${search}%`,
            },
          },
          {
            email: {
              [Op.like]: `%${search}%`,
            },
          },
        ],
        [Op.and]: [
          {
            [Op.or]: [
              sequelize.literal(
                "(SELECT COUNT(*) FROM Merchants WHERE Merchants.UserId = User.id AND Merchants.isVerified = true) > 0"
              ),
              { "$Merchant.id$": null },
            ],
          },
        ],
      },
      include: [
        {
          model: Merchant,
          required: false,
          attributes: [],
        },
      ],
      offset: offset,
      limit: limit,
    });
    const totalPage = Math.ceil(response.count / limit);
    response.rows.map(({ dataValues }) => {
      delete dataValues.password;
      return dataValues;
    });
    return handleSuccess(res, {
      data: response.rows,
      totalPage: totalPage,
      totalRows: response.count,
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
    const response = await User.findAndCountAll({
      where: {
        id: { [Op.ne]: id },
        [Op.or]: [
          {
            fullName: {
              [Op.like]: `%${search}%`,
            },
          },
          {
            email: {
              [Op.like]: `%${search}%`,
            },
          },
        ],
      },
      include: { model: Merchant, where: { isVerified: false } },
      offset: offset,
      limit: limit,
    });
    const totalPage = Math.ceil(response.count / limit);
    response.rows.map(({ dataValues }) => {
      delete dataValues.password;
      return dataValues;
    });
    return handleSuccess(res, {
      data: response.rows,
      totalPage: totalPage,
      totalRows: response.count,
    });
  } catch (error) {
    return handleServerError(res);
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.body;
    const isExist = await User.findByPk(id);
    if (!isExist) return handleNotFound(res);
    await isExist.destroy({ where: { id: id } });

    await chatStreamClient.deleteUser(id.toString(), {
      delete_conversation_channels: true,
    });
    await chatStreamClient.restoreUsers([id.toString()]);
    await chatStreamClient.upsertUser({
      id: id.toString(),
      name: null,
      image: null,
    });

    return handleSuccess(res, {
      message: "app_user_deleted",
    });
  } catch (error) {
    return handleServerError(res);
  }
};

exports.verifyUser = async (req, res) => {
  try {
    const { id } = req.body;
    const isExist = await User.findByPk(id);
    if (!isExist) return handleNotFound(res);

    await Merchant.update({ isVerified: true }, { where: { userId: id } });

    return handleSuccess(res, { message: "app_account_verified" });
  } catch (error) {
    console.log(error);
    return handleServerError(res);
  }
};

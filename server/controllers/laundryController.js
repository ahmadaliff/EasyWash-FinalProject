require("dotenv").config();
const { Op } = require("sequelize");
const { checkStatusOrder } = require("../helpers/checkStatusOrderHelper");
const {
  handleNotFound,
  handleServerError,
  handleCreated,
  handleSuccess,
  handleClientError,
} = require("../helpers/handleResponseHelper");
const {
  validateJoi,
  schemaService,
  schemaMerchant,
} = require("../helpers/joiHelper");

const { chatStreamClient } = require("../utils/streamChatUtil");

const { Merchant, Service, Order } = require("../models");

exports.getMerchant = async (req, res) => {
  try {
    const { id } = req;
    const response = await Merchant.findOne({
      where: { userId: id },
    });
    if (!response) {
      return handleNotFound(res);
    }
    return handleSuccess(res, { data: response });
  } catch (error) {
    return handleServerError(res);
  }
};

exports.editMerchant = async (req, res) => {
  try {
    const { id } = req;
    const data = req.body;
    const field = Object.keys(data);
    const { error, handleRes } = validateJoi(res, data, schemaMerchant, field);
    if (error) {
      return handleRes;
    }
    const isExist = await Merchant.findOne({
      where: { userId: id },
    });
    if (!isExist) {
      return handleNotFound(res);
    }
    const response = await isExist.update(data);

    await chatStreamClient.upsertUser({
      id: id.toString(),
      name: response.name,
      image: `${process.env.SERVER_HOST}${response.imagePath}`,
    });

    return handleSuccess(res, {
      message: "app_updated_merchant",
      data: response,
    });
  } catch (error) {
    return handleServerError(res);
  }
};

exports.editPhotoMerchant = async (req, res) => {
  try {
    const { id } = req;
    const image = req?.file?.path;
    if (!image) {
      return handleNotFound(res);
    }
    const isExist = await Merchant.findOne({
      where: { userId: id },
    });
    if (!isExist) {
      return handleNotFound(res);
    }
    const response = await isExist.update({ imagePath: image });

    await chatStreamClient.upsertUser({
      id: id.toString(),
      name: response.name,
      image: `${process.env.SERVER_HOST}${image}`,
    });

    return handleSuccess(res, {
      data: response,
      message: "app_updated_merchant_photo",
    });
  } catch (error) {
    return handleServerError(res);
  }
};

exports.getMyService = async (req, res) => {
  try {
    const { id } = req;
    const page = parseInt(req.query.page) || 0;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || "";
    const offset = limit * page;
    const response = await Service.findAndCountAll({
      where: {
        name: {
          [Op.like]: "%" + search + "%",
        },
      },
      include: {
        model: Merchant,
        where: {
          userId: id,
        },
        attributes: [],
        required: true,
      },
      offset: offset,
      limit: limit,
    });
    const totalPage = Math.ceil(response.count / limit);
    return handleSuccess(res, {
      data: response.rows,
      totalPage: totalPage,
      totalRows: response.count,
    });
  } catch (error) {
    return handleServerError(res);
  }
};

exports.getServiceById = async (req, res) => {
  try {
    const { id } = req;
    const { serviceId } = req.params;
    const response = await Service.findOne({
      where: { id: serviceId },
      include: {
        model: Merchant,
        where: {
          userId: id,
        },
        attributes: [],
        required: true,
      },
    });
    return handleSuccess(res, { data: response });
  } catch (error) {
    return handleServerError(res);
  }
};

exports.addService = async (req, res) => {
  try {
    const { id } = req;
    const newService = req.body;
    const { error, handleRes } = validateJoi(res, newService, schemaService);
    if (error) {
      return handleRes;
    }
    const isExistByName = await Service.findOne({
      where: { name: newService.name },
      include: {
        model: Merchant,
        where: {
          userId: id,
        },
        required: true,
      },
    });
    if (isExistByName) {
      return handleClientError(res, 400, "app_service_already_exist");
    }
    const getMerchant = await Merchant.findOne({ where: { userId: id } });
    if (!getMerchant) {
      return handleNotFound(res);
    }
    newService.merchantId = getMerchant.id;

    await Service.create(newService);

    return handleCreated(res, { message: "app_service_created" });
  } catch (error) {
    return handleServerError(res);
  }
};

exports.editService = async (req, res) => {
  try {
    const { serviceId } = req.params;
    const dataService = req.body;
    const field = Object.keys(dataService);
    const { error, handleRes } = validateJoi(
      res,
      dataService,
      schemaService,
      field
    );
    if (error) {
      return handleRes;
    }

    await Service.update(dataService, { where: { id: serviceId } });

    return handleSuccess(res, { message: "app_service_updated" });
  } catch (error) {
    return handleServerError(res);
  }
};

exports.deleteService = async (req, res) => {
  try {
    const { serviceId } = req.params;
    await Service.destroy({ where: { id: serviceId } });
    return handleSuccess(res, { message: "app_service_deleted" });
  } catch (error) {
    return handleServerError(res);
  }
};

exports.getOrders = async (req, res) => {
  try {
    const { id } = req;
    const page = parseInt(req.query.page) || 0;
    const limit = parseInt(req.query.limit) || 10;
    const offset = limit * page;
    const response = await Order.findAndCountAll({
      include: {
        model: Service,
        include: {
          model: Merchant,
          where: {
            userId: id,
          },
          attributes: ["location"],
          required: true,
        },
      },
      required: true,
      offset: offset,
      limit: limit,
    });
    const totalPage = Math.ceil(response.count / limit);
    return handleSuccess(res, {
      data: response.rows,
      totalPage: totalPage,
      totalRows: response.count,
    });
  } catch (error) {
    return handleServerError(res);
  }
};

exports.getOrderById = async (req, res) => {
  try {
    const { id } = req;
    const { orderId } = req.params;
    const response = await Order.findOne({
      where: {
        id: orderId,
      },
      include: {
        model: Service,
        include: {
          model: Merchant,
          where: {
            userId: id,
          },
          attributes: [],
          required: true,
        },
        required: true,
        attributes: [],
      },
    });
    if (!response) {
      return handleNotFound(res);
    }
    return handleSuccess(res, { data: response });
  } catch (error) {
    return handleServerError(res);
  }
};

exports.addTotalPriceOrder = async (req, res) => {
  try {
    const { id } = req;
    const { orderId } = req.params;
    const { totalPrice, weigth } = req.body;
    const isExist = await Order.findOne({
      where: { id: orderId },
      include: Service,
    });
    const myMerchant = await Merchant.findOne({ where: { userId: id } });
    if (!isExist || !myMerchant) {
      return handleNotFound(res);
    }
    if (isExist.Service[0].merchantId !== myMerchant.id) {
      return handleClientError(res, 400, { message: "app_not_have_access" });
    }
    if (isExist.status !== "app_pickup") {
      return handleClientError(res, 400, "app_status_invalid");
    }
    await isExist.update({ totalPrice: totalPrice, weigth: weigth });
    return handleSuccess(res, { message: "app_success_add_total_price" });
  } catch (error) {
    return handleServerError(res);
  }
};

exports.changeStatus = async (req, res) => {
  try {
    const { io } = req;
    const { orderId, newStatus } = req.body;
    if (!checkStatusOrder(newStatus) || newStatus === "app_pickUp") {
      return handleClientError(res, 400, "app_status_invalid");
    }
    const isExist = await Order.findOne({ where: { id: orderId } });
    if (!isExist) {
      return handleNotFound(res);
    }

    const response = await isExist.update({ status: newStatus });

    io.emit(`statusUpdated/${orderId}`, response.status);
    return handleSuccess(res, { message: "app_status_updated" });
  } catch (error) {
    return handleServerError(res);
  }
};

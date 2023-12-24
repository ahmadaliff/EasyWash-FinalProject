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
    if (!getMerchant) return handleNotFound(res);
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
    const isExist = await Service.findOne({
      where: { id: serviceId },
      include: {
        model: Order,
        where: {
          status: {
            [Op.notIn]: ["app_finish", " app_rejected", "app_expired"],
          },
        },
        required: false,
      },
    });
    if (!isExist) return handleNotFound(res);
    if (isExist.Orders.length > 0)
      return handleClientError(res, 400, "app_cannot_edit_service");

    await Service.update(dataService, { where: { id: serviceId } });

    return handleSuccess(res, { message: "app_service_updated" });
  } catch (error) {
    console.log(error);
    return handleServerError(res);
  }
};

exports.changeEnableStatusService = async (req, res) => {
  try {
    const { serviceId } = req.params;
    const service = await Service.findOne({ where: { id: serviceId } });
    if (!service) return handleNotFound(res);
    await service.update({ enable: !service.enable });
    return handleSuccess(res, { message: "app_service_status" });
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
    console.log(error);
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
    if (!isExist) return handleNotFound(res);

    const response = await isExist.update({ status: newStatus });
    io.emit(`statusUpdated/${orderId}`, response.status);

    return handleSuccess(res, { message: "app_status_updated" });
  } catch (error) {
    return handleServerError(res);
  }
};

exports.getMerchant = async (req, res) => {
  try {
    const { id } = req;
    const response = await Merchant.findOne({
      where: { userId: id },
    });
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
    if (!isExist) return handleNotFound(res);
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
    if (!image) return handleNotFound(res);
    const isExist = await Merchant.findOne({
      where: { userId: id },
    });
    if (!isExist) return handleNotFound(res);
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

const {
  handleServerError,
  handleSuccess,
  handleNotFound,
  handleCreated,
  handleClientError,
} = require("../helpers/handleResponseHelper");
const {
  Merchant,
  Cart,
  Favorit,
  Order,
  ServicesOrdered,
  Service,
} = require("../models");
const getDistance = require("../utils/getDistanceUtil");

exports.getAllLaundry = async (req, res) => {
  try {
    const { location } = req.body;
    if (!location) {
      return handleNotFound(res);
    }
    const reqLocation = JSON.parse(location);
    const response = await Merchant.findAll();
    const filteredResponse = response.filter((merchant) => {
      const { lat, lng } = JSON.parse(merchant.location);
      const distance = getDistance(reqLocation.lat, reqLocation.lng, lat, lng);
      merchant.dataValues.distance = distance;
      return distance < 3;
    });
    return handleSuccess(res, { data: filteredResponse });
  } catch (error) {
    console.log(error);
    return handleServerError(res);
  }
};

exports.getFavorit = async (req, res) => {
  try {
    const { id } = req;
    const response = await Favorit.findAll({
      where: { userId: id },
      include: Merchant,
    });

    if (!response) {
      return handleNotFound(res);
    }

    return handleSuccess(res, { data: response });
  } catch (error) {
    return handleServerError(res);
  }
};

exports.addToFavorit = async (req, res) => {
  try {
    const { id } = req;
    const { merchantId } = req.params;
    const isExist = await Favorit.findOne({
      where: { userId: id, merchantId: merchantId },
    });
    if (isExist) {
      return handleClientError(res, 400, "app_success_already_fav");
    }
    const response = await Favorit.create({
      userId: id,
      merchantId: merchantId,
    });
    return handleCreated(res, {
      data: response,
      message: "app_success_add_to_fav",
    });
  } catch (error) {
    return handleServerError(res);
  }
};

exports.deleteFromFavorit = async (req, res) => {
  try {
    const { id } = req;
    const { merchantId } = req.params;
    const isExist = await Favorit.findOne({
      where: { userId: id, merchantId: merchantId },
    });
    if (!isExist) {
      return handleNotFound(res);
    }
    const response = await Favorit.destroy({
      userId: id,
      merchantId: merchantId,
    });
    return handleSuccess(res, { message: "app_success_delete_from_fav" });
  } catch (error) {
    return handleServerError(res);
  }
};

exports.getCart = async (req, res) => {
  try {
    const { id } = req;
    const response = await Cart.findAll({
      where: { userId: id },
      include: Service,
    });

    if (!response) {
      return handleNotFound(res);
    }

    return handleSuccess(res, { data: response });
  } catch (error) {
    return handleServerError(res);
  }
};

exports.addToCart = async (req, res) => {
  try {
    const { id } = req;
    const { serviceId, quantity } = req.body;
    const isExist = await Cart.findOne({
      where: { userId: id, serviceId: serviceId },
    });
    if (isExist) {
      return handleClientError(res, 400, "app_success_already_exist");
    }
    const response = await Cart.create({
      userId: id,
      serviceId: serviceId,
      quantity: quantity,
    });
    return handleCreated(res, {
      data: response,
      message: "app_success_add_to_cart",
    });
  } catch (error) {
    return handleServerError(res);
  }
};

exports.updateQuantity = async (req, res) => {
  try {
    const { id } = req;
    const { serviceId, quantity } = req.body;
    const isExist = await Cart.findOne({
      where: { userId: id, serviceId: serviceId },
    });
    if (!isExist) {
      return handleNotFound(res);
    }
    const response = await isExist.update({ quantity: quantity });
    return handleSuccess(res, { data: response });
  } catch (error) {
    return handleServerError(res);
  }
};

exports.deleteFromCart = async (req, res) => {
  try {
    const { id } = req;
    const { serviceId } = req.params;
    const isExist = await Cart.findOne({
      where: { userId: id, serviceId: serviceId },
    });
    if (!isExist) {
      return handleNotFound(res);
    }
    await Cart.destroy({
      userId: id,
      serviceId: serviceId,
    });
    return handleSuccess(res, { message: "app_success_delete_from_cart" });
  } catch (error) {
    return handleServerError(res);
  }
};

exports.getMyOrders = async (req, res) => {
  try {
    const { id } = req;
    const response = await Order.findAll({
      where: {
        userId: id,
      },
      include: Service,
    });
    if (!response) {
      return handleNotFound(res);
    }
    return handleSuccess(res, { data: response });
  } catch (error) {
    return handleServerError(res);
  }
};

exports.getMyOrderById = async (req, res) => {
  try {
    const { id } = req;
    const { orderId } = req.params;
    const response = await Order.findOne({
      where: {
        userId: id,
        id: orderId,
      },
      include: Service,
    });
    if (!response) {
      return handleNotFound(res);
    }
    return handleSuccess(res, { data: response });
  } catch (error) {
    console.log(error);
    return handleServerError(res);
  }
};

exports.createOrder = async (req, res) => {
  try {
    const { id } = req;
    const { orderItems, location } = req.body;
    if (!orderItems) {
      return handleNotFound(res);
    }
    const order = await Order.create({
      userId: id,
      status: "app_pending",
      location: location,
    });

    orderItems.forEach(async (item) => {
      await ServicesOrdered.create({
        serviceId: item.serviceId,
        orderId: order.id,
        quantity: item.quantity,
      });
    });

    const result = await Order.findOne({
      where: { id: order.id },
      include: Service,
    });

    const total = result.Service.reduce((acc, service) => {
      return acc + service.ServicesOrdered.quantity * service.price;
    }, 0);

    await Order.update({ totalPrice: total }, { where: { id: order.id } });

    return handleCreated(res, { message: "app_created_order" });
  } catch (error) {
    return handleServerError(res);
  }
};

exports.cancelOrder = async (req, res) => {
  try {
    const { id } = req;
    const { orderId } = req.params;
    const isExist = await Order.findOne({
      where: { userId: id, id: orderId },
    });
    if (!isExist) {
      return handleNotFound(res);
    }
    if (isExist.status !== "pending") {
      return handleClientError(res, 400, "app_cannot_cancel_order");
    }
    await Order.destroy({
      id: orderId,
    });
    return handleSuccess(res, { message: "app_cancel_order_success" });
  } catch (error) {
    return handleServerError(res);
  }
};

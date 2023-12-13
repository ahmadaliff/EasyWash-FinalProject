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
  sequelize,
} = require("../models");
const getDistance = require("../utils/getDistanceUtil");

exports.getAllLaundry = async (req, res) => {
  try {
    const { location } = req.body;
    if (!location) {
      return handleNotFound(res);
    }
    const reqLocation = JSON.parse(location);
    const response = await Merchant.findAll({ include: Favorit });
    const filteredResponse = response.filter((merchant) => {
      const { lat, lng } = JSON.parse(merchant.location);
      const distance = getDistance(reqLocation.lat, reqLocation.lng, lat, lng);
      merchant.dataValues.distance = distance;
      return distance < 3;
    });
    return handleSuccess(res, { data: filteredResponse });
  } catch (error) {
    return handleServerError(res);
  }
};

exports.getLaundryById = async (req, res) => {
  try {
    const { location } = req.body;
    const { merchantId } = req.params;
    if (!location || !merchantId) {
      return handleNotFound(res);
    }
    const reqLocation = JSON.parse(location);
    const response = await Merchant.findOne({
      where: { id: merchantId },
      include: Service,
    });
    if (!response) {
      return handleNotFound(res);
    }
    const { lat, lng } = JSON.parse(response.location);
    const distance = getDistance(reqLocation.lat, reqLocation.lng, lat, lng);
    if (distance > 3) {
      return handleClientError(res, 400, "app_laundry_out_of_range");
    }
    response.dataValues.distance = distance;
    return handleSuccess(res, { data: response });
  } catch (error) {
    return handleServerError(res);
  }
};

exports.getFavorit = async (req, res) => {
  try {
    const { id } = req;
    const response = await Merchant.findAll({
      include: {
        model: Favorit,
        where: { userId: id },
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
    await isExist.destroy();
    return handleSuccess(res, { message: "app_success_delete_from_fav" });
  } catch (error) {
    console.log(error);
    return handleServerError(res);
  }
};

exports.getCart = async (req, res) => {
  try {
    const { id } = req;
    const response = await Merchant.findAll({
      include: {
        model: Service,
        include: {
          model: Cart,
          where: { userId: id },
          atrributes: ["quantity"],
          required: true,
        },
        required: true,
        atrributes: ["id"],
      },
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
    const { cartId } = req.params;
    const isExist = await Cart.findOne({
      where: { userId: id, id: cartId },
    });

    if (!isExist) {
      return handleNotFound(res);
    }
    await isExist.destroy();
    return handleSuccess(res, { message: "app_success_delete_from_cart" });
  } catch (error) {
    console.log(error);
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
      include: { model: Service, include: Merchant },
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
    if (!orderItems || !location) {
      return handleNotFound(res);
    }
    const cartId = [];
    const filteredOrderItems = orderItems.map(({ id, ...order }) => {
      if (id) {
        cartId.push(id);
      }
      return order;
    });
    await sequelize.transaction(async (t) => {
      const order = await Order.create(
        {
          userId: id,
          status: "app_pending",
          location: location,
        },
        { transaction: t }
      );

      for (let i = 0; i < filteredOrderItems.length; i++) {
        const item = filteredOrderItems[i];
        await ServicesOrdered.create(
          {
            serviceId: item.serviceId,
            orderId: order.id,
            quantity: item.quantity,
          },
          { transaction: t }
        );
      }

      const result = await Order.findOne({
        where: { id: order.id },
        include: Service,
        transaction: t,
      });

      const total = result.Services.reduce((acc, service) => {
        return acc + service.ServicesOrdered.quantity * service.price;
      }, 0);

      await Order.update(
        { totalPrice: total },
        { where: { id: order.id }, transaction: t }
      );
      if (cartId.length > 0) {
        for (let j = 0; j < cartId.length; j++) {
          const id = cartId[j];
          await Cart.destroy({ where: { id: id }, transaction: t });
        }
      }
    });

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
    if (isExist.status !== "app_pending") {
      return handleClientError(res, 400, "app_cannot_cancel_order");
    }
    await isExist.destroy();
    return handleSuccess(res, { message: "app_cancel_order_success" });
  } catch (error) {
    console.log(error);
    return handleServerError(res);
  }
};

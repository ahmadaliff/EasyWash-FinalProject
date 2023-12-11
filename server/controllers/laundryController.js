const {
  handleNotFound,
  handleServerError,
  handleCreated,
  handleSuccess,
  handleClientError,
} = require("../helpers/handleResponseHelper");
const { validateJoi, schemaService } = require("../helpers/joiHelper");
const { Merchant, Service } = require("../models");

exports.getMyService = async (req, res) => {
  try {
    const { id } = req;
    const response = await Service.findAll({
      include: {
        model: Merchant,
        where: {
          userId: id,
        },
        attributes: [],
      },
    });
    return handleSuccess(res, { data: response });
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
      },
    });
    if (isExistByName) {
      return handleClientError(res, 400, "app_service_already_exist");
    }
    const getMerchant = await Merchant.findOne({ where: { userId: id } });
    if (!getMerchant) {
      console.log(id);
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
    console.log(error);
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

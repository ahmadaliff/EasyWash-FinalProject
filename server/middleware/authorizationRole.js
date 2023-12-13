const {
  handleClientError,
  handleNotFound,
} = require("../helpers/handleResponseHelper");
const { Service, Merchant } = require("../models");

exports.authorizationRoleAdmin = async (req, res, next) => {
  const { role } = req;
  if (role != "admin") {
    return handleClientError(
      res,
      401,
      "unauthorize, forbidden access this endpoint login with admin account"
    );
  }
  next();
};

exports.authorizationRoleLaundry = async (req, res, next) => {
  const { role } = req;
  if (role != "laundry") {
    return handleClientError(
      res,
      401,
      "unauthorize, forbidden access this endpoint login with laundry account"
    );
  }
  next();
};

exports.authorizationRoleUser = async (req, res, next) => {
  const { role } = req;
  if (role != "user") {
    return handleClientError(
      res,
      401,
      "unauthorize, forbidden access this endpoint login with user account"
    );
  }
  next();
};

exports.authorizationOwnService = async (req, res, next) => {
  const { id } = req;
  const { serviceId } = req.params;

  if (serviceId) {
    const service = await Service.findOne({
      where: { id: serviceId },
      include: {
        model: Merchant,
      },
    });
    const merchant = service?.Merchant;
    if (!merchant) {
      return handleNotFound(res);
    } else if (merchant?.userId != id) {
      return handleClientError(res, 401, "Forbidden, not your merchant");
    }
  }

  next();
};

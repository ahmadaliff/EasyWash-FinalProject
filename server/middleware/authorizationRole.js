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
      403,

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
      403,

      "unauthorize, forbidden access this endpoint login with standard account"
    );
  }
  next();
};

exports.authorizationOwnService = async (req, res, next) => {
  const { id } = req;
  const { serviceId } = req.params;

  console.log(req);
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
      return handleClientError(res, 403, "Forbidden, not your merchant");
    }
  }

  next();
};

const { handleResponse } = require("../helpers/handleResponseHelper");

exports.authorizationRoleAdmin = async (req, res, next) => {
  const { role } = req;
  if (role != "admin") {
    return handleResponse(res, 403, {
      message:
        "unauthorize, forbidden access this endpoint login with admin account",
    });
  }
  next();
};

exports.authorizationRoleStandart = async (req, res, next) => {
  const { role } = req;
  if (role != "standard") {
    return handleResponse(res, 403, {
      message:
        "unauthorize, forbidden access this endpoint login with standard account",
    });
  }
  next();
};

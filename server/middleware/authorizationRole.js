const { handleResponse } = require("../helpers/handleResponseHelper");

exports.authorizationRolePro = async (req, res, next) => {
  const { role } = req;
  if (role != "pro") {
    return handleResponse(res, 403, {
      message:
        "unauthorize, forbidden access this endpoint login with pro account",
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

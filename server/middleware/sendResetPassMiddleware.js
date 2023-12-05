const { handleClientError } = require("../helpers/handleResponseHelper");
const { verifyTokenForForgetPassword } = require("../utils/jwtUtil");

exports.verifySendResetMiddleware = async (req, res, next) => {
  const { token } = req.body;
  if (!token) return res.sendStatus(403);
  const { email, error } = verifyTokenForForgetPassword(token);
  if (error) {
    return handleClientError(res, 403, "app_token_expired");
  }
  req.email = email;
  next();
};

const { verifyTokenVerifyEmail } = require("../utils/jwtUtil");

exports.verifyEmailMiddleware = async (req, res, next) => {
  const { token } = req.body;
  if (!token) return res.sendStatus(403);
  const { email, otp, error } = verifyTokenVerifyEmail(token);
  if (error) {
    return handleClientError(res, 403, "app_token_expired");
  }
  req.email = email;
  req.otpJWT = otp;
  next();
};

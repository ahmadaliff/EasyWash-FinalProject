const { verifyTokenVerifyEmail } = require("../utils/jwtUtil");

exports.verifyEmailMiddleware = async (req, res, next) => {
  const { token } = req.body;
  if (!token) return res.sendStatus(403);
  const { email, otp } = verifyTokenVerifyEmail(token);
  req.email = email;
  req.otpJWT = otp;
  next();
};

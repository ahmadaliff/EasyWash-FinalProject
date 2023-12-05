const env = require("dotenv");
const jwt = require("jsonwebtoken");
env.config();

const secretKey = process.env.SECRET_KEY;
const secretKeyVerifyEmail = process.env.SECRET_KEY_VERIFY_EMAIL;
const secretKeyForForgetPassword = process.env.SECRET_KEY_FOR_FORGET_PASSWORD;

exports.createToken = (user) => {
  const { role, id, fullName } = user;
  if (!role || !id || !fullName) {
    return false;
  }
  return jwt.sign({ id, role, fullName }, secretKey);
};

exports.verifyToken = (token) => {
  return jwt.verify(token, secretKey, (err, decoded) => {
    if (decoded) return decoded;
    if (err) return { error: true };
  });
};

// JWT UTILS for Verify Email
exports.createTokenVerifyEmail = (otp, email) => {
  if (!otp || !email) {
    return false;
  }
  return jwt.sign({ otp, email }, secretKeyVerifyEmail, { expiresIn: "2m" });
};

exports.verifyTokenVerifyEmail = (token) => {
  return jwt.verify(token, secretKeyVerifyEmail, (err, decoded) => {
    if (decoded) return decoded;
    if (err) return { error: true };
  });
};

// JWT UTILS for Forgot Password
exports.createTokenForForgetPassword = (email) => {
  if (!email) {
    return false;
  }
  return jwt.sign({ email }, secretKeyForForgetPassword, { expiresIn: "10m" });
};

exports.verifyTokenForForgetPassword = (token) => {
  return jwt.verify(token, secretKeyForForgetPassword, (err, decoded) => {
    if (decoded) return decoded;
    if (err) return { error: true };
  });
};

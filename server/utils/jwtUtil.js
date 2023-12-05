const env = require("dotenv");
const jwt = require("jsonwebtoken");
env.config();

const secretKey = process.env.SECRET_KEY;
const secretKeyVerifyEmail = process.env.SECRET_KEY_VERIFY_EMAIL;

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
  return jwt.verify(token, secretKeyVerifyEmail);
};

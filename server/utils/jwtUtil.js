const env = require("dotenv");
const jwt = require("jsonwebtoken");
env.config();

const secretKey = process.env.SECRET_KEY;

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

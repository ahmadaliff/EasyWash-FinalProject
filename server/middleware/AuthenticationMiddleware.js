const { verifyToken } = require("../utils/jwtUtil");
const redisClient = require("../utils/redisClient");
const { User } = require("../models");
const {
  handleNotFound,
  handleClientError,
} = require("../helpers/handleResponseHelper");

exports.authenticationMiddleware = async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader) return res.sendStatus(403);
  const token = authHeader.replace("Bearer ", "");
  const { id, role, fullName, error } = verifyToken(token);

  if (error) return res.sendStatus(403);
  const chacheToken = await redisClient.get(id.toString());
  if (token !== chacheToken) {
    return handleClientError(res, 403, "app_token_expired");
  }
  const isExist = await User.findOne({ where: { id: id } });
  if (!isExist) {
    return handleNotFound(res, 403, "app_token_expired");
  }
  if (isExist.role != role) {
    return handleClientError(res, 403, "app_token_expired");
  }
  req.id = id;
  req.fullName = fullName;
  req.role = role;
  next();
};

const CryptoJS = require("crypto-js");
const { unlink } = require("fs");
const dotenv = require("dotenv");

const {
  handleServerError,
  handleSuccess,
  handleResponse,
  handleNotFound,
  handleClientError,
} = require("../helpers/handleResponseHelper");
const { validateJoi, schemaUser } = require("../helpers/joiHelper");
const {
  handleSendMailForgotPass,
  handleSendMailVerifyOTP,
} = require("../helpers/sendMailHelper");

const { comparePassword, hashPassword } = require("../utils/bcryptUtil");
const {
  createToken,
  createTokenForForgetPassword,
  createTokenVerifyEmail,
} = require("../utils/jwtUtil");
const redisClient = require("../utils/redisClient");

const { User } = require("../models");

const { chatStreamClient } = require("../utils/streamChatUtil");

dotenv.config();

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const maxAttempts = process.env.MAX_ATTEMPTS_LOGIN;
    const attemptsExpire = eval(process.env.ATTEMPTS_EXPIRE);
    redisClient.expire(`loginAttempts:${email}`, attemptsExpire);
    const attempts = await redisClient.incr(`loginAttempts:${email}`);
    if (attempts > maxAttempts) {
      return handleClientError(
        res,
        400,
        `hit maximum Login Attempt, try again in ${attemptsExpire} seconds`
      );
    }
    const plainPassword = CryptoJS.AES.decrypt(
      password,
      process.env.CRYPTOJS_SECRET
    ).toString(CryptoJS.enc.Utf8);

    const { error, handleRes } = validateJoi(
      res,
      { email, password: plainPassword },
      schemaUser,
      ["email", "password"]
    );
    if (error) {
      return handleRes;
    }
    const dataUser = await User.findOne({
      where: { email: email },
    });

    if (!dataUser || !comparePassword(plainPassword, dataUser?.password)) {
      return handleResponse(res, 400, { message: "invalid email or password" });
    }
    const token = createToken(dataUser);
    if (!token) {
      throw new Error("Token Created failed");
    }
    redisClient.setex(dataUser.id.toString(), 24 * 60 * 60, token);
    return handleSuccess(res, {
      imagePath: dataUser.imagePath,
      token: token,
      message: "Login success",
    });
  } catch (error) {
    return handleServerError(res);
  }
};

exports.logout = async (req, res) => {
  try {
    const { id } = req;
    // delete token
    redisClient.del(id.toString());
    return handleSuccess(res, { message: "logout" });
  } catch (error) {
    return handleServerError(res);
  }
};

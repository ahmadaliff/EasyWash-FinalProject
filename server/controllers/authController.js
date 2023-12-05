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
      return handleClientError(res, 400, `app_login_max_attemps`);
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
      return handleResponse(res, 400, { message: "app_login_invalid" });
    }
    if (!dataUser.isVerify) {
      return handleResponse(res, 400, {
        message: "app_login_not_verify",
      });
    }
    const token = createToken(dataUser);
    if (!token) {
      throw new Error("Token Created failed");
    }
    redisClient.setex(dataUser.id.toString(), 24 * 60 * 60, token);
    redisClient.del(`loginAttempts:${email}`);
    return handleSuccess(res, {
      imagePath: dataUser.imagePath,
      token: token,
      message: "app_login_success",
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
    return handleSuccess(res, { message: "app_logout_success" });
  } catch (error) {
    return handleServerError(res);
  }
};

exports.register = async (req, res) => {
  try {
    const newUser = req.body;

    const plainPassword = CryptoJS.AES.decrypt(
      newUser.password,
      process.env.CRYPTOJS_SECRET
    ).toString(CryptoJS.enc.Utf8);

    newUser.password = plainPassword;

    const { error, handleRes } = validateJoi(res, newUser, schemaUser);
    if (error) {
      return handleRes;
    }
    const isExist = await User.findOne({ where: { email: newUser.email } });
    if (isExist) {
      return handleResponse(res, 400, {
        message: "app_register_already_exist",
      });
    }
    const response = await User.create(newUser);

    return handleSuccess(res, {
      data: response,
      message:
        newUser.role === "laundry"
          ? `app_register_success_laundry`
          : `app_register_success`,
    });
  } catch (error) {
    return handleServerError(res);
  }
};

exports.verifyEmail = async (req, res) => {
  try {
    const { email } = req.body;
    const dataUser = await User.findOne({ where: { email: email } });
    if (dataUser) {
      return handleResponse(res, 400, {
        message: "app_register_already_exist",
      });
    }
    const OTP = Math.floor(Math.random() * 9000 + 1000);
    const status = handleSendMailVerifyOTP(OTP, email);
    if (status) {
      return handleSuccess(res, {
        data: {
          token: createTokenVerifyEmail(OTP, email),
          expire: Date.now() + 2 * 60 * 1000,
        },
        message: "app_verify_email_otp_send",
      });
    }
    return handleSuccess(res, {
      message: "app_verify_email_otp_failed",
    });
  } catch (error) {
    console.log(error);
    return handleServerError(res);
  }
};

exports.checkOtpVerifyEmail = async (req, res) => {
  try {
    const { otp } = req.body;
    const { otpJWT, email } = req;
    const dataUser = await User.findOne({ where: { email: email } });
    if (dataUser) {
      return handleResponse(res, 400, {
        message: "app_register_already_exist",
      });
    }
    if (otp != otpJWT) {
      return handleResponse(res, 404, {
        message: "app_verify_email_otp_invalid",
      });
    }
    return handleSuccess(res, { message: "app_verify" });
  } catch (error) {
    return handleServerError(res);
  }
};

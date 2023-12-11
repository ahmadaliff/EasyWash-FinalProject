require("dotenv").config();
const CryptoJS = require("crypto-js");
const { unlink } = require("fs");
require("cookie-parser");

const {
  handleServerError,
  handleSuccess,
  handleNotFound,
  handleClientError,
} = require("../helpers/handleResponseHelper");
const {
  validateJoi,
  schemaUser,
  schemaMerchant,
} = require("../helpers/joiHelper");
const {
  handleSendMailForgotPass,
  handleSendMailVerifyOTP,
} = require("../helpers/sendMailHelper");

const { comparePassword, hashPassword } = require("../utils/bcryptUtil");
const {
  createToken,
  createTokenForForgetPassword,
  createTokenVerifyEmail,
  createRefreshToken,
  verifyRefreshToken,
} = require("../utils/jwtUtil");
const redisClient = require("../utils/redisClient");

const { User, Merchant, sequelize } = require("../models");

const { chatStreamClient } = require("../utils/streamChatUtil");

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
      return handleClientError(res, 400, "app_login_invalid");
    }
    if (!dataUser.isVerified) {
      return handleClientError(res, 400, "app_login_not_verify");
    }
    const token = createToken(dataUser);
    const refreshToken = createRefreshToken(dataUser);

    if (!token || !refreshToken) {
      throw new Error("Token Created failed");
    }

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    });

    redisClient.setex(dataUser.id.toString(), 10 * 60, token);
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
    const { id } = req.body;
    redisClient.del(id.toString());
    return handleSuccess(res, { message: "app_logout_success" });
  } catch (error) {
    console.log(error);
    return handleServerError(res);
  }
};

exports.refreshToken = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken)
      return handleClientError(res, 401, "app_session_expired");
    const { id, role, errorJWT } = verifyRefreshToken(refreshToken);
    if (errorJWT) {
      return handleClientError(res, 401, "app_session_expired");
    }
    const dataUser = await User.findOne({ where: { id: id, role: role } });
    if (!dataUser) {
      return handleNotFound(res);
    }
    const token = createToken(dataUser);
    redisClient.setex(dataUser.id.toString(), 10 * 60, token);
    return handleSuccess(res, { token: token });
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

    const merchant = newUser.merchant;
    delete newUser.merchant;

    const { error, handleRes } = validateJoi(res, newUser, schemaUser);
    if (error) {
      return handleRes;
    }
    if (merchant) {
      const { error, handleRes } = validateJoi(res, merchant, schemaMerchant);
      if (error) {
        return handleRes;
      }
    }
    const isExist = await User.findOne({ where: { email: newUser.email } });
    if (isExist) {
      return handleClientError(res, 400, "app_register_already_exist");
    }

    const response = await sequelize.transaction(async (t) => {
      const responseUser = await User.create(newUser, { transaction: t });
      if (newUser.role === "laundry") {
        merchant.userId = responseUser.id;
        merchant.location = JSON.stringify(merchant.location);
        await Merchant.create(merchant, {
          transaction: t,
        });
      }
      return responseUser;
    });

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
      return handleClientError(res, 400, "app_register_already_exist");
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
    return handleServerError(res);
  }
};

exports.checkOtpVerifyEmail = async (req, res) => {
  try {
    const { otp } = req.body;
    const { otpJWT, email } = req;
    const dataUser = await User.findOne({ where: { email: email } });
    if (dataUser) {
      return handleClientError(res, 400, "app_register_already_exist");
    }
    if (otp != otpJWT) {
      return handleClientError(res, 400, "app_verify_email_otp_invalid");
    }
    return handleSuccess(res, { message: "app_verify" });
  } catch (error) {
    return handleServerError(res);
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const isUserExist = await User.findOne({
      where: { email: email, isVerified: true },
    });
    if (!isUserExist) {
      return handleNotFound(res);
    }
    const token = createTokenForForgetPassword(email);
    const resp = await handleSendMailForgotPass(token, email);
    if (resp.accepted.length > 0) {
      return handleSuccess(res, {
        message: "app_forgot_password_email_sent",
      });
    } else {
      return handleSuccess(res, {
        message: "app_forgot_password_email_failed",
      });
    }
  } catch (error) {
    return handleServerError(res);
  }
};

exports.setResetPassword = async (req, res) => {
  try {
    const { email } = req;
    const { new_password } = req.body;

    const plainPassword = CryptoJS.AES.decrypt(
      new_password,
      process.env.CRYPTOJS_SECRET
    ).toString(CryptoJS.enc.Utf8);

    const isUserExist = await User.findOne({ where: { email: email } });
    if (!isUserExist) {
      return handleNotFound(res);
    }
    await User.update(
      { password: hashPassword(plainPassword) },
      { where: { email: email } }
    );
    return handleSuccess(res, {
      message: "app_reset_password_success",
    });
  } catch (error) {
    return handleServerError(res);
  }
};

exports.getProfile = async (req, res) => {
  try {
    const { id } = req;
    const response = await User.findByPk(id);
    delete response.password;
    return handleSuccess(res, { data: response, message: "success" });
  } catch (error) {
    return handleServerError(res);
  }
};

exports.editPhotoProfile = async (req, res) => {
  try {
    const { id } = req;
    const image = req?.file?.path;
    if (!image) {
      return handleNotFound(res);
    }
    const user = await User.findOne({ where: { id: id } });
    if (user.imagePath) {
      unlink(user.imagePath, (err) => {});
    }
    const response = await user.update({ imagePath: image });

    return handleSuccess(res, {
      data: response,
      message: "app_edit_photo_profile_success",
    });
  } catch (error) {
    return handleServerError(res);
  }
};

exports.editProfile = async (req, res) => {
  try {
    const { id } = req;
    const newUser = req.body;
    if (newUser?.new_password || newUser?.old_password) {
      const plainNewPassword = CryptoJS.AES.decrypt(
        newUser.new_password,
        process.env.CRYPTOJS_SECRET
      ).toString(CryptoJS.enc.Utf8);
      const plainOldPassword = CryptoJS.AES.decrypt(
        newUser.old_password,
        process.env.CRYPTOJS_SECRET
      ).toString(CryptoJS.enc.Utf8);
      if (!comparePassword(plainOldPassword, isExist.password)) {
        return handleClientError(res, 400, "app_edit_profile_pass_invalid");
      }
      newUser.password = hashPassword(plainNewPassword);
      delete newUser.new_password;
      delete newUser.old_password;
    }
    const fieldtoEdit = Object.keys(newUser);
    const { error, handleRes } = validateJoi(
      res,
      newUser,
      schemaUser,
      fieldtoEdit
    );
    if (error) {
      return handleRes;
    }
    const response = await User.update(newUser, { where: { id: id } });

    return handleSuccess(res, {
      data: response,
      message: "success edit profile",
    });
  } catch (error) {
    return handleServerError(res);
  }
};

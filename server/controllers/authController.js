const CryptoJS = require("crypto-js");
const { google } = require("googleapis");
const { unlink } = require("fs");
require("dotenv").config();
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
  handleSendMailPassword,
} = require("../helpers/sendMailHelper");

const { comparePassword, hashPassword } = require("../utils/bcryptUtil");
const { chatStreamClient } = require("../utils/streamChatUtil");
const {
  createToken,
  createTokenForForgetPassword,
  createTokenVerifyEmail,
  createRefreshToken,
  verifyRefreshToken,
} = require("../utils/jwtUtil");
const redisClient = require("../utils/redisClient");
const { oauth2Client, authorizationUrl } = require("../utils/googleLoginUtil");

const { User, Merchant, sequelize } = require("../models");

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
      include: Merchant,
    });
    if (!dataUser || !comparePassword(plainPassword, dataUser?.password)) {
      return handleClientError(res, 400, "app_login_invalid");
    }
    if (dataUser.Merchant && !dataUser.Merchant?.isVerified) {
      return handleClientError(res, 400, "app_login_not_verify");
    }
    const token = createToken(dataUser);
    const refreshToken = createRefreshToken(dataUser);

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
    console.log(error);
    return handleServerError(res);
  }
};

exports.redirectGoogle = (req, res) => {
  try {
    return handleSuccess(res, { Location: authorizationUrl });
  } catch (error) {
    return handleServerError(res);
  }
};

exports.handleLoginGoogle = async (req, res) => {
  try {
    const { code } = req.body;
    if (!code) return handleClientError(res, 400, "app_login_failed");
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);
    const oauth2 = google.oauth2({
      auth: oauth2Client,
      version: "v2",
    });
    const { data } = await oauth2.userinfo.get();
    const randPassword = Math.random().toString(36).substring(2, 10);
    const [user, created] = await User.findOrCreate({
      where: { email: data.email },
      defaults: {
        fullName: data.name,
        imagePath: data.picture,
        role: "user",
        password: randPassword,
      },
    });

    const token = createToken(user);
    const refreshToken = createRefreshToken(user);
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    });
    redisClient.setex(user.id.toString(), 10 * 60, token);

    const body = {
      imagePath: user.imagePath,
      token: token,
      message: "app_login_success",
    };
    if (created) {
      handleSendMailPassword(randPassword, data.email);
      body.created = "app_user_created_check_email";
    }

    return handleSuccess(res, body);
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
    return handleServerError(res);
  }
};

exports.refreshToken = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken)
      return handleClientError(res, 401, "app_session_expired");
    const { id, role, error } = verifyRefreshToken(refreshToken);
    if (error) return handleClientError(res, 401, "app_session_expired");
    const dataUser = await User.findOne({ where: { id: id, role: role } });
    if (!dataUser) return handleNotFound(res);
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
      if (newUser.role === "merchant") {
        merchant.userId = responseUser.id;
        merchant.location = JSON.stringify(merchant.location);
        await Merchant.create(merchant, {
          transaction: t,
        });
      }
      return responseUser;
    });

    await chatStreamClient.upsertUser({
      id: response.id.toString(),
      name: response.role !== "merchant" ? response.fullName : merchant.name,
      image: null,
    });

    return handleSuccess(res, {
      data: response,
      message:
        newUser.role === "merchant"
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
      where: { email: email },
    });
    if (!isUserExist) return handleNotFound(res);
    const token = createTokenForForgetPassword(email);
    await handleSendMailForgotPass(token, email);
    return handleSuccess(res, {
      message: "app_forgot_password_email_sent",
    });
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
    if (!isUserExist) return handleNotFound(res);
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
    if (!image) return handleNotFound(res);
    const user = await User.findOne({ where: { id: id } });
    if (user.imagePath) {
      unlink(user.imagePath, (err) => {});
    }
    const response = await user.update({ imagePath: image });

    if (user.role !== "merchant") {
      await chatStreamClient.upsertUser({
        id: response.id.toString(),
        name: response.fullName,
        image: `${process.env.SERVER_HOST}${image}`,
      });
    }

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
    const user = await User.findOne({ where: { id: id } });
    if (newUser?.new_password || newUser?.old_password) {
      const plainNewPassword = CryptoJS.AES.decrypt(
        newUser.new_password,
        process.env.CRYPTOJS_SECRET
      ).toString(CryptoJS.enc.Utf8);
      const plainOldPassword = CryptoJS.AES.decrypt(
        newUser.old_password,
        process.env.CRYPTOJS_SECRET
      ).toString(CryptoJS.enc.Utf8);
      if (!comparePassword(plainOldPassword, user.password)) {
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
    const response = await user.update(newUser);

    if (user.role !== "merchant") {
      await chatStreamClient.upsertUser({
        id: id.toString(),
        name: user.fullName,
        image: `${process.env.SERVER_HOST}${user.imagePath}`,
      });
    }

    return handleSuccess(res, {
      data: response,
      message: "app_edit_profile_success",
    });
  } catch (error) {
    return handleServerError(res);
  }
};

import {
  FORGOT_PASSWORD,
  IS_VERIFY,
  LOGIN,
  LOGOUT,
  REGISTER,
  RESET_REGISTER_VALUE,
  SEND_OTP,
  SEND_RESET_PASSWORD,
  SEND_VERIFY_EMAIL,
  SET_LOGIN,
  SET_TOKEN,
  SET_TOKEN_VERIFY,
  SET_USER,
} from '@containers/Client/constants';

export const setLogin = (login) => ({
  type: SET_LOGIN,
  login,
});

export const setUser = (user) => ({
  type: SET_USER,
  user,
});

export const setToken = (token) => ({
  type: SET_TOKEN,
  token,
});

export const actionHandleLogin = (data, callback) => ({
  type: LOGIN,
  data,
  callback,
});

export const actionHandleLogout = (callback) => ({
  type: LOGOUT,
  callback,
});

export const actionSetVerify = (isVerify) => ({
  type: IS_VERIFY,
  isVerify,
});

export const actionSetTokenVerify = (token) => ({
  type: SET_TOKEN_VERIFY,
  token,
});

export const actionHandleSendEmailVerify = (data) => ({
  type: SEND_VERIFY_EMAIL,
  data,
});

export const actionHandleSendOTP = (data) => ({
  type: SEND_OTP,
  data,
});

export const actionHandleRegister = (data, callback) => ({
  type: REGISTER,
  data,
  callback,
});

export const actionResetRegisterValue = () => ({
  type: RESET_REGISTER_VALUE,
});

export const actionSendForgotPassword = (data, callback) => ({
  type: FORGOT_PASSWORD,
  data,
  callback,
});

export const actionResetPassword = (data, callback) => ({
  type: SEND_RESET_PASSWORD,
  data,
  callback,
});

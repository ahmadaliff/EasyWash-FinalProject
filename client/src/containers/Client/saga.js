import CryptoJS from 'crypto-js';
import toast from 'react-hot-toast';
import { jwtDecode } from 'jwt-decode';
import { takeLatest, call, put, select } from 'redux-saga/effects';

import config from '@config/index';

import intlHelper from '@utils/intlHelper';

import {
  apiHandleLogin,
  apiHandleLogout,
  apiHandleCheckOtpVerifyEmail,
  apiHandleSendVerifyEmail,
  apiHandleRegister,
  apiHandleSendForgotPassword,
  apiHandleResetForgotPassword,
  apiHandleLoginGoogle,
  apiHandleGetUserLoginGoogle,
} from '@domain/api';

import {
  FORGOT_PASSWORD,
  LOGIN,
  LOGIN_GOOGLE,
  LOGOUT,
  REGISTER,
  SEND_OTP,
  SEND_RESET_PASSWORD,
  SEND_VERIFY_EMAIL,
} from '@containers/Client/constants';
import { showPopup, setLoading } from '@containers/App/actions';
import { actionHandleResetStep, actionSetEmail, actionSetExpire, actionSetStep } from '@pages/Register/actions';
import {
  actionResetRegisterValue,
  actionSetTokenVerify,
  actionSetVerify,
  setLogin,
  setToken,
  setUser,
} from '@containers/Client/actions';
import { selectUser } from '@containers/Client/selectors';
import { selectMerchant } from '@pages/Register/selectors';
import { actionResetTokenMessage } from '@pages/ChatPage/actions';
import { actionResetServices } from '@pages/LaundryServices/actions';
import { actionResetService } from '@pages/EditService/actions';
import { actionResetDeletedMerchants } from '@pages/DeletedMerchant/action';

function* sagaHandleLogin({ data, callback }) {
  yield put(setLoading(true));
  try {
    data.password = CryptoJS.AES.encrypt(data.password, config.api.secretKeyCrypto).toString();
    const response = yield call(apiHandleLogin, data);
    yield call(callback);
    yield put(setLogin(true));
    yield put(setToken(response.token));
    const { role, id, fullName } = jwtDecode(response.token);
    yield put(setUser({ role, id, fullName, imagePath: response.imagePath }));
    toast.success(intlHelper({ message: response.message }));
  } catch (error) {
    if (error?.response?.status === 400) {
      toast.error(intlHelper({ message: error.response.data.message }));
    } else {
      yield put(showPopup());
    }
  }
  yield put(setLoading(false));
}

function* sagaHandleLoginGoogle({ code, callback }) {
  yield put(setLoading(true));
  try {
    if (!code) {
      const response = yield call(apiHandleLoginGoogle);
      window.location.href = response.Location;
    } else {
      const response = yield call(apiHandleGetUserLoginGoogle, { code });
      yield call(callback);
      yield put(setLogin(true));
      yield put(setToken(response.token));
      const { role, id, fullName } = jwtDecode(response.token);
      yield put(setUser({ role, id, fullName, imagePath: response.imagePath }));
      toast.success(intlHelper({ message: response.message }));
      if (response.created) toast.success(intlHelper({ message: response.created }));
    }
  } catch (error) {
    if (error?.response?.status === 400) {
      toast.error(intlHelper({ message: error.response.data.message }));
    } else {
      yield put(showPopup());
    }
  }
  yield put(setLoading(false));
}

function* sagaHandleLogout({ callback }) {
  yield put(setLoading(true));
  try {
    const user = yield select(selectUser);
    if (user) {
      const response = yield call(apiHandleLogout, user.id);
      toast.success(intlHelper({ message: response?.message }));
      yield put(setLogin(false));
      yield put(setToken(null));
      yield put(setUser(null));
      yield put(actionResetServices());
      yield put(actionResetService());
      yield put(actionResetTokenMessage());
      yield put(actionResetDeletedMerchants());
      if (callback) {
        yield call(callback);
      }
    }
  } catch (error) {
    if (error?.response?.status === 400 || error?.response?.status === 401) {
      toast.error(intlHelper({ message: error.response.data.message }));
    } else {
      yield put(showPopup());
    }
  }
  yield put(setLoading(false));
}

function* sagaHandleSendVerifyEmail({ data }) {
  yield put(setLoading(true));
  try {
    const response = yield call(apiHandleSendVerifyEmail, data);
    toast.success(intlHelper({ message: response?.message }));
    yield put(actionSetVerify(false));
    yield put(actionSetStep(1));
    yield put(actionSetTokenVerify(response.data.token));
    yield put(actionSetExpire(response.data.expire));
    yield put(actionSetEmail(data.email));
  } catch (error) {
    if (error?.response?.status === 400 || error?.response?.status === 404 || error?.response?.status === 401) {
      toast.error(intlHelper({ message: error.response.data.message }));
    } else {
      yield put(showPopup());
    }
  }
  yield put(setLoading(false));
}

function* sagaHandleSendOTP({ data }) {
  yield put(setLoading(true));
  try {
    const response = yield call(apiHandleCheckOtpVerifyEmail, data);
    toast.success(intlHelper({ message: response?.message }));
    yield put(actionSetStep(2));
    yield put(actionSetVerify(true));
  } catch (error) {
    if (error?.response?.status === 400 || error?.response?.status === 404 || error?.response?.status === 401) {
      toast.error(intlHelper({ message: error.response.data.message }));
    } else {
      yield put(showPopup());
    }
  }
  yield put(setLoading(false));
}

function* sagaHandleRegister({ data, callback }) {
  yield put(setLoading(true));
  try {
    data.password = CryptoJS.AES.encrypt(data.password, config.api.secretKeyCrypto).toString();
    const merchant = yield select(selectMerchant);
    if (data.role !== 'user') {
      data.merchant = merchant;
    }
    const response = yield call(apiHandleRegister, data);
    toast.success(intlHelper({ message: response?.message }));
    yield put(actionResetRegisterValue());
    yield put(actionHandleResetStep());
    yield call(callback);
  } catch (error) {
    if (error?.response?.status === 400 || error?.response?.status === 404 || error?.response?.status === 401) {
      toast.error(intlHelper({ message: error.response.data.message }));
    } else {
      yield put(showPopup());
    }
  }
  yield put(setLoading(false));
}

function* sagaHandleSendEmailForgot({ data, callback }) {
  yield put(setLoading(true));
  try {
    const response = yield call(apiHandleSendForgotPassword, data);
    toast.success(intlHelper({ message: response?.message }));
    yield call(callback);
  } catch (error) {
    if (error?.response?.status === 404) {
      toast.error(intlHelper({ message: error.response.data.message }));
    } else {
      yield put(showPopup());
    }
  }
  yield put(setLoading(false));
}

function* sendResetPassword({ data, callback }) {
  yield put(setLoading(true));
  try {
    data.new_password = CryptoJS.AES.encrypt(data.new_password, config.api.secretKeyCrypto).toString();
    const response = yield call(apiHandleResetForgotPassword, data);
    toast.success(intlHelper({ message: response?.message }));
    yield call(callback);
  } catch (error) {
    if (error?.response?.status === 404 || error?.response?.status === 403) {
      toast.error(intlHelper({ message: error.response.data.message }));
    } else {
      yield put(showPopup());
    }
  }
  yield put(setLoading(false));
}

export default function* clientSaga() {
  yield takeLatest(LOGIN, sagaHandleLogin);
  yield takeLatest(LOGIN_GOOGLE, sagaHandleLoginGoogle);
  yield takeLatest(LOGOUT, sagaHandleLogout);
  yield takeLatest(SEND_VERIFY_EMAIL, sagaHandleSendVerifyEmail);
  yield takeLatest(SEND_OTP, sagaHandleSendOTP);
  yield takeLatest(REGISTER, sagaHandleRegister);
  yield takeLatest(FORGOT_PASSWORD, sagaHandleSendEmailForgot);
  yield takeLatest(SEND_RESET_PASSWORD, sendResetPassword);
}

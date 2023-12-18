import { takeLatest, call, put } from 'redux-saga/effects';
import toast from 'react-hot-toast';
import CryptoJS from 'crypto-js';

import { apiHandleEditPhotoProfile, apiHandleEditProfile, apiHandleGetProfile } from '@domain/api';

import intlHelper from '@utils/intlHelper';

import config from '@config/index';

import { showPopup, setLoading } from '@containers/App/actions';
import { EDIT_PHOTO_PROFILE, EDIT_PROFILE, GET_PROFILE } from '@pages/Profile/constants';
import { actionSetProfile } from '@pages/Profile/actions';

function* sagaHandleGetUser() {
  yield put(setLoading(true));
  try {
    const response = yield call(apiHandleGetProfile);
    yield put(actionSetProfile(response.data));
  } catch (error) {
    if (error?.response?.status === 400 || error?.response?.status === 404 || error?.response?.status === 401) {
      toast.error(intlHelper({ message: error.response.data.message }));
    } else {
      yield put(showPopup());
    }
  }
  yield put(setLoading(false));
}

function* sagaHandleEditPhotoProfile({ data }) {
  yield put(setLoading(true));
  try {
    const response = yield call(apiHandleEditPhotoProfile, { image: data });
    yield put(actionSetProfile(response.data));
    toast.success(intlHelper({ message: response?.message }));
  } catch (error) {
    if (error?.response?.status === 400 || error?.response?.status === 404 || error?.response?.status === 401) {
      toast.error(intlHelper({ message: error.response.data.message }));
    } else {
      yield put(showPopup());
    }
  }
  yield put(setLoading(false));
}

function* sagaHandleEditProfile({ data }) {
  yield put(setLoading(true));
  try {
    if (data?.new_password || data?.old_password) {
      data.new_password = CryptoJS.AES.encrypt(data.new_password, config.api.secretKeyCrypto).toString();
      data.old_password = CryptoJS.AES.encrypt(data.old_password, config.api.secretKeyCrypto).toString();
    }
    const response = yield call(apiHandleEditProfile, data);
    toast.success(intlHelper({ message: response?.message }));
    yield put(actionSetProfile(response.data));
  } catch (error) {
    if (error?.response?.status === 400 || error?.response?.status === 404 || error?.response?.status === 401) {
      toast.error(intlHelper({ message: error.response.data.message }));
    } else {
      yield put(showPopup());
    }
  }
  yield put(setLoading(false));
}

export default function* profileSaga() {
  yield takeLatest(GET_PROFILE, sagaHandleGetUser);
  yield takeLatest(EDIT_PHOTO_PROFILE, sagaHandleEditPhotoProfile);
  yield takeLatest(EDIT_PROFILE, sagaHandleEditProfile);
}

import { call, put, takeLatest } from 'redux-saga/effects';
import { DELETE_USER, GET_UNVERIFIED_USERS, GET_USERS, VERIFY_USER } from '@pages/Users/constants';
import { setLoading, showPopup } from '@containers/App/actions';
import { actionSetUsers } from '@pages/Users/actions';
import toast from 'react-hot-toast';
import { apiDeleteUser, apiGetUserUnverified, apiGetUsers, apiVerifyUser } from '@domain/api';
import intlHelper from '@utils/intlHelper';

function* sagaGetUsers({ search, limit, page }) {
  yield put(setLoading(true));
  try {
    const response = yield call(apiGetUsers, search, limit, page);
    yield put(actionSetUsers(response));
  } catch (error) {
    if (error?.response?.status === 400 || error?.response?.status === 404) {
      toast.error(intlHelper({ message: error.response.data.message }));
    } else {
      yield put(showPopup());
    }
  }
  yield put(setLoading(false));
}

function* sagaGetUnverifiedUsers({ search, limit, page }) {
  yield put(setLoading(true));
  try {
    const response = yield call(apiGetUserUnverified, search, limit, page);
    yield put(actionSetUsers(response));
  } catch (error) {
    if (error?.response?.status === 400 || error?.response?.status === 404) {
      toast.error(intlHelper({ message: error.response.data.message }));
    } else {
      yield put(showPopup());
    }
  }
  yield put(setLoading(false));
}

function* sagaVerifyUser({ data }) {
  yield put(setLoading(true));
  try {
    const response = yield call(apiVerifyUser, { id: data });
    toast.success(intlHelper({ message: response.message }));
  } catch (error) {
    if (error?.response?.status === 400 || error?.response?.status === 404) {
      toast.error(intlHelper({ message: error.response.data.message }));
    } else {
      yield put(showPopup());
    }
  }
  yield put(setLoading(false));
}

function* sagaDeleteUser({ data }) {
  yield put(setLoading(true));
  try {
    const response = yield call(apiDeleteUser, { id: data });
    toast.success(intlHelper({ message: response.message }));
  } catch (error) {
    if (error?.response?.status === 400 || error?.response?.status === 404) {
      toast.error(intlHelper({ message: error.response.data.message }));
    } else {
      yield put(showPopup());
    }
  }
  yield put(setLoading(false));
}

export default function* usersSaga() {
  yield takeLatest(GET_USERS, sagaGetUsers);
  yield takeLatest(GET_UNVERIFIED_USERS, sagaGetUnverifiedUsers);
  yield takeLatest(DELETE_USER, sagaDeleteUser);
  yield takeLatest(VERIFY_USER, sagaVerifyUser);
}

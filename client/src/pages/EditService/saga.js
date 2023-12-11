import toast from 'react-hot-toast';
import { call, put, takeLatest } from 'redux-saga/effects';

import { apiEditServices, apiGetService } from '@domain/api';

import intlHelper from '@utils/intlHelper';

import { EDIT_SERVICE, GET_SERVICE } from '@pages/EditService/constants';

import { actionSetService } from '@pages/EditService/actions';
import { setLoading, showPopup } from '@containers/App/actions';

function* sagaEditService({ id, data, callback }) {
  yield put(setLoading(true));
  try {
    const response = yield call(apiEditServices, data, id);
    toast.success(intlHelper({ message: response.message }));
    yield call(callback);
  } catch (error) {
    if (error?.response?.status === 400 || error?.response?.status === 404) {
      toast.error(intlHelper({ message: error.response.data.message }));
    } else {
      yield put(showPopup());
    }
  }
  yield put(setLoading(false));
}

function* sagaGetService({ id }) {
  yield put(setLoading(true));
  try {
    const response = yield call(apiGetService, id);
    yield put(actionSetService(response.data));
  } catch (error) {
    if (error?.response?.status === 400 || error?.response?.status === 404) {
      toast.error(intlHelper({ message: error.response.data.message }));
    } else {
      yield put(showPopup());
    }
  }
  yield put(setLoading(false));
}

export default function* editServiceSaga() {
  yield takeLatest(EDIT_SERVICE, sagaEditService);
  yield takeLatest(GET_SERVICE, sagaGetService);
}

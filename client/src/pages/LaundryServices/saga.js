import { call, put, takeLatest } from 'redux-saga/effects';
import { DELETE_SERVICE, GET_SERVICES } from '@pages/LaundryServices/constants';
import { setLoading, showPopup } from '@containers/App/actions';
import toast from 'react-hot-toast';
import { apiDeleteService, apiGetServices } from '@domain/api';
import intlHelper from '@utils/intlHelper';
import { actionSetServices } from './actions';

function* sagaGetServices({ search, limit, page }) {
  yield put(setLoading(true));
  try {
    const response = yield call(apiGetServices, search, limit, page);
    yield put(actionSetServices(response));
  } catch (error) {
    if (error?.response?.status === 400 || error?.response?.status === 404) {
      toast.error(intlHelper({ message: error.response.data.message }));
    } else {
      yield put(showPopup());
    }
  }
  yield put(setLoading(false));
}

function* sagaDeleteService({ data }) {
  yield put(setLoading(true));
  try {
    const response = yield call(apiDeleteService, data);
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

export default function* servicesSaga() {
  yield takeLatest(GET_SERVICES, sagaGetServices);
  yield takeLatest(DELETE_SERVICE, sagaDeleteService);
}

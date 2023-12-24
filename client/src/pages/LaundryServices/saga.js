import { call, put, takeLatest } from 'redux-saga/effects';
import { CHANGE_ENABLE_STATUS_SERVICE, GET_SERVICES } from '@pages/LaundryServices/constants';
import { setLoading, showPopup } from '@containers/App/actions';
import toast from 'react-hot-toast';
import { apiGetServices, apichangeEnableStatusService } from '@domain/api';
import intlHelper from '@utils/intlHelper';
import { actionSetServices } from './actions';

function* sagaGetServices({ search, limit, page }) {
  yield put(setLoading(true));
  try {
    const response = yield call(apiGetServices, search, limit, page);
    yield put(actionSetServices(response));
  } catch (error) {
    if (error?.response?.status === 400 || error?.response?.status === 404 || error?.response?.status === 401) {
      toast.error(intlHelper({ message: error.response.data.message }));
    } else {
      yield put(showPopup());
    }
  }
  yield put(setLoading(false));
}

function* sagaChangeStatusService({ id }) {
  yield put(setLoading(true));
  try {
    const response = yield call(apichangeEnableStatusService, id);
    toast.success(intlHelper({ message: response.message }));
  } catch (error) {
    if (error?.response?.status === 400 || error?.response?.status === 404 || error?.response?.status === 401) {
      toast.error(intlHelper({ message: error.response.data.message }));
    } else {
      yield put(showPopup());
    }
  }
  yield put(setLoading(false));
}

export default function* servicesSaga() {
  yield takeLatest(GET_SERVICES, sagaGetServices);
  yield takeLatest(CHANGE_ENABLE_STATUS_SERVICE, sagaChangeStatusService);
}

import { call, put, takeLatest } from 'redux-saga/effects';
import { setLoading, showPopup } from '@containers/App/actions';
import toast from 'react-hot-toast';
import { apiChangeStatus, apiGetLaundryOrders } from '@domain/api';
import intlHelper from '@utils/intlHelper';
import { actionSetOrders } from './actions';
import { CHANGE_STATUS, GET_ORDERS } from './constants';

function* sagaGetOrders({ limit, page }) {
  yield put(setLoading(true));
  try {
    const response = yield call(apiGetLaundryOrders, limit, page);
    yield put(actionSetOrders(response));
  } catch (error) {
    if (error?.response?.status === 400 || error?.response?.status === 404 || error?.response?.status === 401) {
      toast.error(intlHelper({ message: error.response.data.message }));
    } else {
      yield put(showPopup());
    }
  }
  yield put(setLoading(false));
}

function* sagaChangeStatus({ id, newStatus }) {
  yield put(setLoading(true));
  try {
    // eslint-disable-next-line object-shorthand
    const response = yield call(apiChangeStatus, { orderId: id, newStatus: newStatus });
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

export default function* laundryOrdersSaga() {
  yield takeLatest(GET_ORDERS, sagaGetOrders);
  yield takeLatest(CHANGE_STATUS, sagaChangeStatus);
}

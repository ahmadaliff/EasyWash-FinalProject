import { setLoading, showPopup } from '@containers/App/actions';
import { apiCancelOrder, apiGetMyOrder } from '@domain/api';
import intlHelper from '@utils/intlHelper';
import toast from 'react-hot-toast';
import { call, put, takeLatest } from 'redux-saga/effects';
import { actionSetMyOrder } from './action';
import { CANCEL_ORDER, GET_ORDERS } from './constants';

function* sagaGetMyOrder() {
  yield put(setLoading(true));
  try {
    const response = yield call(apiGetMyOrder);
    yield put(actionSetMyOrder(response.data));
  } catch (error) {
    if (error?.response?.status === 400 || error?.response?.status === 404 || error?.response?.status === 401) {
      toast.error(error.response.data.message);

      toast.error(intlHelper({ message: error.response.data.message }));
    } else {
      yield put(showPopup());
    }
  }
  yield put(setLoading(false));
}

function* sagaCancelOrder({ id, callback }) {
  yield put(setLoading(true));
  try {
    const response = yield call(apiCancelOrder, id);
    toast.success(intlHelper({ message: response.message }));
    yield call(callback);
  } catch (error) {
    if (error?.response?.status === 400 || error?.response?.status === 404 || error?.response?.status === 401) {
      toast.error(error.response.data.message);

      toast.error(intlHelper({ message: error.response.data.message }));
    } else {
      yield put(showPopup());
    }
  }
  yield put(setLoading(false));
}

export default function* myOrderSaga() {
  yield takeLatest(GET_ORDERS, sagaGetMyOrder);
  yield takeLatest(CANCEL_ORDER, sagaCancelOrder);
}

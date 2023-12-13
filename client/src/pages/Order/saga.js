import { call, put, takeLatest } from 'redux-saga/effects';
import toast from 'react-hot-toast';

import intlHelper from '@utils/intlHelper';

import { apiCreateOrder } from '@domain/api';

import { setLoading, showPopup } from '@containers/App/actions';
import { CREATE_ORDER } from '@pages/Order/constants';

function* sagaCreateOrder({ data, callback }) {
  yield put(setLoading(true));
  try {
    const response = yield call(apiCreateOrder, data);
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

export default function* orderSaga() {
  yield takeLatest(CREATE_ORDER, sagaCreateOrder);
}

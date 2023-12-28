import { call, put, takeLatest } from 'redux-saga/effects';
import toast from 'react-hot-toast';

import intlHelper from '@utils/intlHelper';

import { apiGetDeletedMerchants } from '@domain/api';

import { GET_DELETED_MERCHANTS } from '@pages/DeletedMerchant/constants';
import { actionSetDeletedMerchants } from '@pages/DeletedMerchant/action';
import { setLoading, showPopup } from '@containers/App/actions';

function* sagaGetDeletedMerchants() {
  yield put(setLoading(true));
  try {
    const response = yield call(apiGetDeletedMerchants);
    yield put(actionSetDeletedMerchants(response.data));
  } catch (error) {
    if (error?.response?.status === 400 || error?.response?.status === 404 || error?.response?.status === 401) {
      toast.error(intlHelper({ message: error.response.data.message }));
    } else {
      yield put(showPopup());
    }
  }
  yield put(setLoading(false));
}

export default function* deletedMerchantsSaga() {
  yield takeLatest(GET_DELETED_MERCHANTS, sagaGetDeletedMerchants);
}

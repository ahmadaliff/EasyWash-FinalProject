import toast from 'react-hot-toast';
import { call, put, takeLatest } from 'redux-saga/effects';

import { apiAddServices } from '@domain/api';

import intlHelper from '@utils/intlHelper';

import { ADD_SERVICE } from '@pages/FormService/constants';
import { setLoading, showPopup } from '@containers/App/actions';

function* sagaAddService({ data, callback }) {
  yield put(setLoading(true));
  try {
    const response = yield call(apiAddServices, data);
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

export default function* formServiceSaga() {
  yield takeLatest(ADD_SERVICE, sagaAddService);
}

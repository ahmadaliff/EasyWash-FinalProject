import { takeLatest, call, put } from 'redux-saga/effects';
import toast from 'react-hot-toast';

import { apiEditMerchant, apiEditPhotoMerchant, apiGetMyMerchant } from '@domain/api';

import intlHelper from '@utils/intlHelper';

import { CHANGE_PHOTO_MERCHANT, EDIT_MERCHANT, GET_MERCHANT } from '@pages/MyMerchant/constants';
import { actionSetMerchant } from '@pages/MyMerchant/actions';
import { showPopup, setLoading } from '@containers/App/actions';

function* sagaHandleGetMerchant() {
  yield put(setLoading(true));
  try {
    const response = yield call(apiGetMyMerchant);
    yield put(actionSetMerchant(response.data));
  } catch (error) {
    if (error?.response?.status === 400 || error?.response?.status === 404) {
      toast.error(error.response.data.message);

      toast.error(intlHelper({ message: error.response.data.message }));
    } else {
      yield put(showPopup());
    }
  }
  yield put(setLoading(false));
}

function* sagaHandleEditPhotoMErchant({ data }) {
  yield put(setLoading(true));
  try {
    const response = yield call(apiEditPhotoMerchant, { image: data });
    yield put(actionSetMerchant(response.data));
    toast.success(intlHelper({ message: response?.message }));
  } catch (error) {
    if (error?.response?.status === 400 || error?.response?.status === 404) {
      toast.error(intlHelper({ message: error.response.data.message }));
    } else {
      yield put(showPopup());
    }
  }
  yield put(setLoading(false));
}

function* sagaHandleEditMerchant({ data }) {
  yield put(setLoading(true));
  try {
    const response = yield call(apiEditMerchant, data);
    toast.success(intlHelper({ message: response?.message }));
    yield put(actionSetMerchant(response.data));
  } catch (error) {
    if (error?.response?.status === 400 || error?.response?.status === 404) {
      toast.error(intlHelper({ message: error.response.data.message }));
    } else {
      yield put(showPopup());
    }
  }
  yield put(setLoading(false));
}

export default function* myMerchantSaga() {
  yield takeLatest(GET_MERCHANT, sagaHandleGetMerchant);
  yield takeLatest(EDIT_MERCHANT, sagaHandleEditMerchant);
  yield takeLatest(CHANGE_PHOTO_MERCHANT, sagaHandleEditPhotoMErchant);
}

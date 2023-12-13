import { call, put, select, takeLatest } from 'redux-saga/effects';
import { ADD_TO_FAVORIT, DELETE_FROM_FAVORIT, GET_FAVORIT_MERCHANTS } from '@pages/Favorit/constants';
import { setLoading, showPopup } from '@containers/App/actions';
import intlHelper from '@utils/intlHelper';
import toast from 'react-hot-toast';
import { apiAddtoFavorit, apiDeleteFromFavorit, apiGetFavoritMerchants } from '@domain/api';
import { actionSetFavoritMerchants } from '@pages/Favorit/action';
import { actionGetMerchants, actionResetMerchants } from '@pages/Home/actions';
import { selectMerchants } from './selectors';

function* sagaGetFavoritMerchants() {
  yield put(setLoading(true));
  try {
    const response = yield call(apiGetFavoritMerchants);
    yield put(actionSetFavoritMerchants(response.data));
  } catch (error) {
    if (error?.response?.status === 400 || error?.response?.status === 404 || error?.response?.status === 401) {
      toast.error(intlHelper({ message: error.response.data.message }));
    } else {
      yield put(showPopup());
    }
  }
  yield put(setLoading(false));
}

function* sagaAddtoFavorit({ id }) {
  yield put(setLoading(true));
  try {
    const response = yield call(apiAddtoFavorit, id);
    const merchants = yield select(selectMerchants);
    merchants?.push(response.data);
    yield put(actionSetFavoritMerchants(merchants));
    yield put(actionResetMerchants());
    yield put(actionGetMerchants());
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

function* sagaDeleteFromFavorit({ id }) {
  yield put(setLoading(true));
  try {
    const response = yield call(apiDeleteFromFavorit, id);
    yield put(actionResetMerchants());
    yield put(actionGetMerchants());
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

export default function* favoritSaga() {
  yield takeLatest(GET_FAVORIT_MERCHANTS, sagaGetFavoritMerchants);
  yield takeLatest(ADD_TO_FAVORIT, sagaAddtoFavorit);
  yield takeLatest(DELETE_FROM_FAVORIT, sagaDeleteFromFavorit);
}

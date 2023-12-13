import toast from 'react-hot-toast';
import { call, put, takeLatest } from 'redux-saga/effects';

import intlHelper from '@utils/intlHelper';

import { apiAddToCart, apiChangeQuantityCart, apiDeleteFromCart, apiGetCarts } from '@domain/api';

import { ADD_TO_CART, CHANGE_QUANTITY, DELETE_FROM_CART, GET_CARTS } from '@pages/Cart/constants';
import { setLoading, showPopup } from '@containers/App/actions';
import { actionGetCarts, actionResetCarts, actionSetCarts } from './action';

function* sagaGetCarts() {
  yield put(setLoading(true));
  try {
    const response = yield call(apiGetCarts);
    yield put(actionSetCarts(response.data));
  } catch (error) {
    if (error?.response?.status === 400 || error?.response?.status === 404) {
      toast.error(intlHelper({ message: error.response.data.message }));
    } else {
      yield put(showPopup());
    }
  }
  yield put(setLoading(false));
}

function* sagaAddToCart({ id }) {
  yield put(setLoading(true));
  try {
    const response = yield call(apiAddToCart, id);
    yield put(actionResetCarts());
    yield put(actionGetCarts());
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

function* sagaDeleteFromCart({ id }) {
  yield put(setLoading(true));
  try {
    const response = yield call(apiDeleteFromCart, id);
    yield put(actionResetCarts());
    yield put(actionGetCarts());
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

function* sagaChangeQuantity({ id, quantity }) {
  yield put(setLoading(true));
  try {
    yield call(apiChangeQuantityCart, { serviceId: id, quantity });
    yield put(actionResetCarts());
    yield put(actionGetCarts());
  } catch (error) {
    if (error?.response?.status === 400 || error?.response?.status === 404) {
      toast.error(intlHelper({ message: error.response.data.message }));
    } else {
      yield put(showPopup());
    }
  }
  yield put(setLoading(false));
}

export default function* cartsSaga() {
  yield takeLatest(GET_CARTS, sagaGetCarts);
  yield takeLatest(ADD_TO_CART, sagaAddToCart);
  yield takeLatest(DELETE_FROM_CART, sagaDeleteFromCart);
  yield takeLatest(CHANGE_QUANTITY, sagaChangeQuantity);
}

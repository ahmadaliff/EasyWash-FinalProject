import { call, put, takeLatest } from 'redux-saga/effects';
import toast from 'react-hot-toast';

import intlHelper from '@utils/intlHelper';

import { apiGetMerchantById } from '@domain/api';

import { GET_MERCHANT } from '@pages/Laundry/constants';
import { actionSetMerchant } from '@pages/Laundry/action';
import { setLoading, showPopup } from '@containers/App/actions';

const getUserLocation = () =>
  new Promise((resolve, reject) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (location) => {
          const { latitude, longitude } = location.coords;
          const loc = { location: JSON.stringify({ lat: latitude, lng: longitude }) };
          resolve(loc);
        },
        (error) => reject(error)
      );
    }
  });

function* sagaGetMerchant({ id }) {
  yield put(setLoading(true));
  try {
    const location = yield call(getUserLocation);
    const response = yield call(apiGetMerchantById, id, location);
    yield put(actionSetMerchant(response.data));
  } catch (error) {
    if (error?.response?.status === 400 || error?.response?.status === 404 || error?.response?.status === 401) {
      toast.error(intlHelper({ message: error.response.data.message }));
    } else {
      yield put(showPopup());
    }
  }
  yield put(setLoading(false));
}

export default function* merchantSaga() {
  yield takeLatest(GET_MERCHANT, sagaGetMerchant);
}

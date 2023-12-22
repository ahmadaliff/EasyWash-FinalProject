import { call, put, takeLatest } from 'redux-saga/effects';
import { setLoading, showPopup } from '@containers/App/actions';
import toast from 'react-hot-toast';
import { apiGetMerchants } from '@domain/api';
import intlHelper from '@utils/intlHelper';
import { GET_MERCHANTS } from './constants';
import { actionSetMerchants } from './actions';

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

function* sagaGetMerchants() {
  yield put(setLoading(true));
  try {
    const location = yield call(getUserLocation);
    const response = yield call(apiGetMerchants, location);
    yield put(actionSetMerchants(response.data));
  } catch (error) {
    if (error?.response?.status === 400 || error?.response?.status === 404 || error?.response?.status === 401) {
      toast.error(intlHelper({ message: error.response.data.message }));
    } else {
      yield put(showPopup());
    }
  }
  yield put(setLoading(false));
}

export default function* homeSaga() {
  yield takeLatest(GET_MERCHANTS, sagaGetMerchants);
}

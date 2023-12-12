import { all } from 'redux-saga/effects';

import homeSaga from '@pages/Home/saga';
import usersSaga from '@pages/Users/saga';
import appSaga from '@containers/App/saga';
import profileSaga from '@pages/Profile/saga';
import favoritSaga from '@pages/Favorit/saga';
import clientSaga from '@containers/Client/saga';
import myMerchantSaga from '@pages/MyMerchant/saga';
import editServiceSaga from '@pages/EditService/saga';
import formServiceSaga from '@pages/FormService/saga';
import statusOrderSaga from '@pages/StatusOrder/saga';
import servicesSaga from '@pages/LaundryServices/saga';
import laundryOrdersSaga from '@pages/LaundryOrders/saga';

export default function* rootSaga() {
  yield all([
    appSaga(),
    clientSaga(),
    profileSaga(),
    usersSaga(),
    formServiceSaga(),
    editServiceSaga(),
    statusOrderSaga(),
    myMerchantSaga(),
    servicesSaga(),
    laundryOrdersSaga(),
    homeSaga(),
    favoritSaga(),
  ]);
}

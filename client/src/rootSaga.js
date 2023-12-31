import { all } from 'redux-saga/effects';

import homeSaga from '@pages/Home/saga';
import cartsSaga from '@pages/Cart/saga';
import orderSaga from '@pages/Order/saga';
import usersSaga from '@pages/Users/saga';
import profileSaga from '@pages/Profile/saga';
import favoritSaga from '@pages/Favorit/saga';
import myOrderSaga from '@pages/MyOrder/saga';
import MessageSaga from '@pages/ChatPage/saga';
import merchantSaga from '@pages/Laundry/saga';
import clientSaga from '@containers/Client/saga';
import myMerchantSaga from '@pages/MyMerchant/saga';
import editServiceSaga from '@pages/EditService/saga';
import formServiceSaga from '@pages/FormService/saga';
import statusOrderSaga from '@pages/StatusOrder/saga';
import servicesSaga from '@pages/LaundryServices/saga';
import laundryOrdersSaga from '@pages/LaundryOrders/saga';
import deletedMerchantsSaga from '@pages/DeletedMerchant/saga';

export default function* rootSaga() {
  yield all([
    homeSaga(),
    cartsSaga(),
    orderSaga(),
    usersSaga(),
    clientSaga(),
    MessageSaga(),
    profileSaga(),
    myOrderSaga(),
    favoritSaga(),
    merchantSaga(),
    servicesSaga(),
    myMerchantSaga(),
    formServiceSaga(),
    editServiceSaga(),
    statusOrderSaga(),
    laundryOrdersSaga(),
    deletedMerchantsSaga(),
  ]);
}

import { combineReducers } from 'redux';

import appReducer, { storedKey as storedAppState } from '@containers/App/reducer';
import clientReducer, { storedKey as storedClientState } from '@containers/Client/reducer';
import registerReducer, { storedKey as storedResisterStep } from '@pages/Register/reducer';
import usersReducer, { storedKey as storedUsersState } from '@pages/Users/reducer';
import orderReducer, { storedKey as storedOrderState } from '@pages/Order/reducer';
import messageReducer, { storedKey as storedMessageState } from '@pages/ChatPage/reducer';
import deletedMerchantsReducer, { storedKey as storedDeletedMerchants } from '@pages/DeletedMerchant/reducer';
import homeReducer, { storedKey as storedhomeState } from '@pages/Home/reducer';
import cartReducer, { storedKey as storedCartState } from '@pages/Cart/reducer';

import laundryOrdersReducer from '@pages/LaundryOrders/reducer';
import servicesReducer from '@pages/LaundryServices/reducer';
import editServiceReducer from '@pages/EditService/reducer';
import statusOrderReducer from '@pages/StatusOrder/reducer';
import languageReducer from '@containers/Language/reducer';
import myMerchantReducer from '@pages/MyMerchant/reducer';
import { merchantReducer } from '@pages/Laundry/reducer';
import myOrderReducer from '@pages/MyOrder/reducer';
import profileReducer from '@pages/Profile/reducer';
import favoritReducer from '@pages/Favorit/reducer';

import { mapWithPersistor } from './persistence';

const storedReducers = {
  app: { reducer: appReducer, whitelist: storedAppState },
  home: { reducer: homeReducer, whitelist: storedhomeState },
  carts: { reducer: cartReducer, whitelist: storedCartState },
  users: { reducer: usersReducer, whitelist: storedUsersState },
  order: { reducer: orderReducer, whitelist: storedOrderState },
  client: { reducer: clientReducer, whitelist: storedClientState },
  message: { reducer: messageReducer, whitelist: storedMessageState },
  registerStep: { reducer: registerReducer, whitelist: storedResisterStep },
  deletedMerchants: { reducer: deletedMerchantsReducer, whitelist: storedDeletedMerchants },
};

const temporaryReducers = {
  language: languageReducer,
  profile: profileReducer,
  editService: editServiceReducer,
  statusOrder: statusOrderReducer,
  myMerchant: myMerchantReducer,
  services: servicesReducer,
  laundryOrders: laundryOrdersReducer,
  favorit: favoritReducer,
  merchant: merchantReducer,
  myOrder: myOrderReducer,
};

const createReducer = () => {
  const coreReducer = combineReducers({
    ...mapWithPersistor(storedReducers),
    ...temporaryReducers,
  });
  const rootReducer = (state, action) => coreReducer(state, action);
  return rootReducer;
};

export default createReducer;

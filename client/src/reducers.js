import { combineReducers } from 'redux';

import appReducer, { storedKey as storedAppState } from '@containers/App/reducer';
import clientReducer, { storedKey as storedClientState } from '@containers/Client/reducer';
import registerReducer, { storedKey as storedResisterStep } from '@pages/Register/reducer';
import usersReducer, { storedKey as storedUsersState } from '@pages/Users/reducer';
import laundryOrdersReducer from '@pages/LaundryOrders/reducer';
import servicesReducer from '@pages/LaundryServices/reducer';
import editServiceReducer from '@pages/EditService/reducer';
import statusOrderReducer from '@pages/StatusOrder/reducer';
import languageReducer from '@containers/Language/reducer';
import myMerchantReducer from '@pages/MyMerchant/reducer';
import profileReducer from '@pages/Profile/reducer';

import { mapWithPersistor } from './persistence';

const storedReducers = {
  app: { reducer: appReducer, whitelist: storedAppState },
  client: { reducer: clientReducer, whitelist: storedClientState },
  registerStep: { reducer: registerReducer, whitelist: storedResisterStep },
  users: { reducer: usersReducer, whitelist: storedUsersState },
};

const temporaryReducers = {
  language: languageReducer,
  profile: profileReducer,
  editService: editServiceReducer,
  statusOrder: statusOrderReducer,
  myMerchant: myMerchantReducer,
  services: servicesReducer,
  laundryOrders: laundryOrdersReducer,
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

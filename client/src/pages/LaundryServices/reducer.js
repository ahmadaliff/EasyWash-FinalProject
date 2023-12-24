import { produce } from 'immer';
import { RESET_SERVICES, SET_SERVICES } from './constants';

export const initialState = {
  services: null,
};

export const servicesReducer = (state = initialState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case SET_SERVICES:
        draft.services = action.services;
        break;
      case RESET_SERVICES:
        draft.services = null;
        break;
    }
  });

export default servicesReducer;

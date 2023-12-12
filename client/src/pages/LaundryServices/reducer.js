import { produce } from 'immer';
import { DELETE_SERVICE, RESET_SERVICES, SET_SERVICES } from './constants';

export const initialState = {
  services: null,
};

export const servicesReducer = (state = initialState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case SET_SERVICES:
        draft.services = action.services;
        break;
      case DELETE_SERVICE: {
        const filteredDataServices = state.services.data.filter((val) => val.id !== action.data);

        const tempObj = { ...state.services };
        tempObj.data = filteredDataServices;
        tempObj.totalRows -= 1;

        draft.services = tempObj;
        break;
      }
      case RESET_SERVICES:
        return initialState;
    }
  });

export default servicesReducer;

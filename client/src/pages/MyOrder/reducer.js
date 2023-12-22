import { produce } from 'immer';
import { RESET_ORDERS, SET_ORDERS } from './constants';

export const initialState = {
  orders: null,
};

export const myOrderReducer = (state = initialState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case SET_ORDERS:
        draft.orders = action.data;
        break;
      case RESET_ORDERS:
        return initialState;
    }
  });

export default myOrderReducer;

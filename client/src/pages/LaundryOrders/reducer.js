import _ from 'lodash';
import { produce } from 'immer';
import { CHANGE_STATUS, RESET_ORDERS, SET_ORDERS } from './constants';

export const initialState = {
  orders: null,
};

export const laundryOrdersReducer = (state = initialState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case SET_ORDERS:
        draft.orders = action.orders;
        break;
      case CHANGE_STATUS: {
        const tempObj = { ...state.orders };

        const filteredDataOrders = tempObj.data.filter((val) => val.id !== action.id);
        const orderToChange = { ...tempObj.data.filter((val) => val.id === action.id)[0] };
        orderToChange.status = action.newStatus;
        filteredDataOrders.push(orderToChange);
        tempObj.data = _.sortBy(filteredDataOrders, [(val) => val.id]);

        draft.orders = tempObj;
        break;
      }
      case RESET_ORDERS:
        return initialState;
    }
  });

export default laundryOrdersReducer;

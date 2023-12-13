import { produce } from 'immer';
import { RESET_ORDER, SET_ORDER } from './constants';

export const initialState = {
  order: null,
};

export const storedKey = ['order'];

export const orderReducer = (state = initialState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case SET_ORDER:
        draft.order = action.data;
        break;
      case RESET_ORDER:
        return initialState;
    }
  });

export default orderReducer;

import { produce } from 'immer';
import { RESET_CARTS, SET_CARTS } from './constants';

export const initialState = {
  carts: null,
};

export const storedKey = ['carts'];

export const cartReducer = (state = initialState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case SET_CARTS:
        draft.carts = action.data;
        break;
      case RESET_CARTS:
        return initialState;
    }
  });

export default cartReducer;

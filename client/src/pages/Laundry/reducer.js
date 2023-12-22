import { produce } from 'immer';
import { RESET_MERCHANT, SET_MERCHANT } from './constants';

export const initialState = {
  merchant: null,
};

export const merchantReducer = (state = initialState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case SET_MERCHANT:
        draft.merchant = action.data;
        break;
      case RESET_MERCHANT:
        return initialState;
    }
  });

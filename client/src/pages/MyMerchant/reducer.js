import { produce } from 'immer';

import { RESET_MERCHANT, SET_MERCHANT } from '@pages/MyMerchant/constants';

export const initialState = {
  merchant: null,
};

const myMerchantReducer = (state = initialState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case SET_MERCHANT:
        draft.merchant = action.merchant;
        break;
      case RESET_MERCHANT:
        return initialState;
    }
  });

export default myMerchantReducer;

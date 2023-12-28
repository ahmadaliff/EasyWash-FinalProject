import { produce } from 'immer';
import { RESET_DELETED_MERCHANTS, SET_DELETED_MERCHANTS } from './constants';

export const initialState = {
  merchants: null,
};

export const storedKey = ['merchants'];

export const deletedMerchantsReducer = (state = initialState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case SET_DELETED_MERCHANTS:
        draft.merchants = action.data;
        break;
      case RESET_DELETED_MERCHANTS:
        return initialState;
    }
  });

export default deletedMerchantsReducer;

import { produce } from 'immer';
import { RESET_MERCHANTS, SET_MERCHANTS } from './constants';

export const initialState = {
  merchants: null,
};

export const storedKey = ['merchants'];

export const homeReducer = (state = initialState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case SET_MERCHANTS:
        draft.merchants = action.data;
        break;
      case RESET_MERCHANTS:
        return initialState;
    }
  });

export default homeReducer;

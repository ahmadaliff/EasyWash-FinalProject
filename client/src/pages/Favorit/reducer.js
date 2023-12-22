import { produce } from 'immer';
import { DELETE_FROM_FAVORIT, RESET_FAVORIT_MERCHANTS, SET_FAVORIT_MERCHANTS } from './constants';

export const initialState = {
  favorit: null,
};

export const favoritReducer = (state = initialState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case SET_FAVORIT_MERCHANTS:
        draft.favorit = action.data;
        break;
      case DELETE_FROM_FAVORIT: {
        draft.favorit = action.id;
        const filteredFavorit = state.favorit?.filter((val) => val.id !== action.id);
        draft.favorit = filteredFavorit;
        break;
      }

      case RESET_FAVORIT_MERCHANTS:
        return initialState;
    }
  });

export default favoritReducer;

import { produce } from 'immer';
import { RESET_SERVICE, SET_SERVICE } from './constants';

export const initialState = {
  service: null,
};

const editServiceReducer = (state = initialState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case SET_SERVICE:
        draft.service = action.data;
        break;
      case RESET_SERVICE:
        return initialState;
    }
  });

export default editServiceReducer;

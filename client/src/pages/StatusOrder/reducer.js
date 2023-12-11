import { produce } from 'immer';
import { SET_STATUS, STATUS_UPDATED } from './constants';

export const initialState = {
  order: null,
  status: null,
};

const statusOrderReducer = (state = initialState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case SET_STATUS:
        draft.order = action.data;
        break;
      case STATUS_UPDATED: {
        const order = { ...state.order };
        order.status = action.data;
        draft.status = order;
        break;
      }
    }
  });

export default statusOrderReducer;

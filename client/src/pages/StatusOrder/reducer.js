import { produce } from 'immer';
import { CONNECTED_SOCKET, DISCONNECT_SOCKET, SET_STATUS, STATUS_UPDATED } from './constants';

export const initialState = {
  order: null,
  socket: null,
};

const statusOrderReducer = (state = initialState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case SET_STATUS:
        draft.order = action.data;
        break;
      case CONNECTED_SOCKET:
        draft.socket = action.data;
        break;
      case DISCONNECT_SOCKET:
        return initialState;
      case STATUS_UPDATED: {
        const order = { ...state.order };
        order.status = action.data;
        draft.order = order;
        break;
      }
    }
  });

export default statusOrderReducer;

import { produce } from 'immer';

import { RESET_TOKEN_STREAM, SET_TOKEN_STREAM } from '@pages/ChatPage/constants';

export const initialState = {
  token: null,
};

export const storedKey = ['token'];

const messageReducer = (state = initialState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case SET_TOKEN_STREAM:
        draft.token = action.token;
        break;
      case RESET_TOKEN_STREAM:
        draft.token = null;
        break;
    }
  });

export default messageReducer;

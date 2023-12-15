import { produce } from 'immer';

import { SET_TOKEN_STREAM, SET_PROFILE, RESET_PROFILE, SET_USERS, RESET_USERS } from '@pages/ChatPage/constants';

export const initialState = {
  profile: null,
  token: null,
  users: null,
};

export const storedKey = ['profile', 'token', 'users'];

const messageReducer = (state = initialState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case SET_PROFILE:
        draft.profile = action.profile;
        break;
      case SET_TOKEN_STREAM:
        draft.token = action.token;
        break;
      case SET_USERS:
        draft.users = action.users;
        break;
      case RESET_USERS:
        draft.users = null;
        break;
      case RESET_PROFILE:
        return initialState;
    }
  });

export default messageReducer;

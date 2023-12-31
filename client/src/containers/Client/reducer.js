import { produce } from 'immer';

import {
  IS_VERIFY,
  RESET_REGISTER_VALUE,
  SET_LOGIN,
  SET_TOKEN,
  SET_TOKEN_VERIFY,
  SET_USER,
} from '@containers/Client/constants';

export const initialState = {
  login: false,
  token: null,
  tokenVerify: null,
  isVerified: false,
  user: null,
};

export const storedKey = ['token', 'login', 'user', 'tokenVerify', 'isVerified'];

const clientReducer = (state = initialState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case SET_LOGIN:
        draft.login = action.login;
        break;
      case SET_TOKEN:
        draft.token = action.token;
        break;
      case SET_USER:
        draft.user = action.user;
        break;
      case SET_TOKEN_VERIFY:
        draft.tokenVerify = action.token;
        break;
      case IS_VERIFY:
        draft.isVerified = action.isVerified;
        break;
      case RESET_REGISTER_VALUE:
        draft.isVerified = initialState.isVerified;
        draft.tokenVerify = initialState.tokenVerify;
        break;
    }
  });

export default clientReducer;

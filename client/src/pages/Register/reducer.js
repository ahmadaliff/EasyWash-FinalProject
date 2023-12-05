import { produce } from 'immer';

import { RESET_STEP, SET_EMAIL, SET_EXPIRE_TIME, SET_STEP } from '@pages/Register/constants';

export const initialState = {
  step: 0,
  email: null,
  expire: null,
};

export const storedKey = ['step', 'email', 'expire'];

const registerReducer = (state = initialState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case SET_STEP:
        draft.step = action.step;
        break;
      case SET_EMAIL:
        draft.email = action.email;
        break;
      case SET_EXPIRE_TIME:
        draft.expire = action.expire;
        break;
      case RESET_STEP:
        return initialState;
    }
  });

export default registerReducer;

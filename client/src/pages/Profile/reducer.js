import { produce } from 'immer';

import { SET_PROFILE, RESET_PROFILE } from '@pages/Profile/constants';

export const initialState = {
  profile: null,
};

const profileReducer = (state = initialState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case SET_PROFILE:
        draft.profile = action.profile;
        break;
      case RESET_PROFILE:
        return initialState;
    }
  });

export default profileReducer;

import { produce } from 'immer';
import { DELETE_USER, RESET_USERS, SET_USERS } from './constants';

export const initialState = {
  users: null,
};

export const storedKey = ['users'];

export const usersReducer = (state = initialState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case SET_USERS:
        draft.users = action.users;
        break;
      case DELETE_USER: {
        const filteredDataUsers = state.users.data.filter((val) => val.id !== action.data);

        const tempObj = { ...state.users };
        tempObj.data = filteredDataUsers;
        tempObj.totalRows -= 1;

        draft.users = tempObj;
        break;
      }
      case RESET_USERS:
        return initialState;
    }
  });

export default usersReducer;

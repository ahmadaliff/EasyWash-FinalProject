import { createSelector } from 'reselect';
import { initialState } from '@pages/Users/reducer';

const selectUsersState = (state) => state.users || initialState;

export const selectUsers = createSelector(selectUsersState, (state) => state.users);

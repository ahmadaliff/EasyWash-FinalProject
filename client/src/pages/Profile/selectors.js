import { createSelector } from 'reselect';
import { initialState } from '@pages/Profile/reducer';

const selectUserState = (state) => state.profile || initialState;

export const selectProfile = createSelector(selectUserState, (state) => state.profile);

import { createSelector } from 'reselect';
import { initialState } from '@containers/Client/reducer';

const selectClientState = (state) => state.client || initialState;

export const selectLogin = createSelector(selectClientState, (state) => state.login);
export const selectToken = createSelector(selectClientState, (state) => state.token);
export const selectUser = createSelector(selectClientState, (state) => state.user);
export const selectTokenEmail = createSelector(selectClientState, (state) => state.tokenVerify);
export const selectIsVerify = createSelector(selectClientState, (state) => state.isVerified);

import { createSelector } from 'reselect';

import { initialState as registerInitialState } from '@pages/Register/reducer';

const selectRegisterState = (state) => state.registerStep || registerInitialState;
export const selectStep = createSelector(selectRegisterState, (state) => state.step);
export const selectEmail = createSelector(selectRegisterState, (state) => state.email);
export const selectExpire = createSelector(selectRegisterState, (state) => state.expire);

import { createSelector } from 'reselect';
import { initialState } from '@pages/Home/reducer';

const selectHomeState = (state) => state.home || initialState;

export const selectMerchants = createSelector(selectHomeState, (state) => state.merchants);

import { createSelector } from 'reselect';
import { initialState } from '@pages/Favorit/reducer';

const selectFavoritState = (state) => state.favorit || initialState;

export const selectMerchants = createSelector(selectFavoritState, (state) => state.favorit);

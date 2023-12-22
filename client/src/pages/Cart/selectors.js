import { createSelector } from 'reselect';
import { initialState } from '@pages/Cart/reducer';

const selectCartsState = (state) => state.carts || initialState;

export const selectMerchants = createSelector(selectCartsState, (state) => state.carts);

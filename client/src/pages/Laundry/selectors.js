import { createSelector } from 'reselect';
import { initialState } from '@pages/Laundry/reducer';

const selectMerchantState = (state) => state.merchant || initialState;

export const selectMerchant = createSelector(selectMerchantState, (state) => state.merchant);

import { createSelector } from 'reselect';
import { initialState } from '@pages/MyMerchant/reducer';

const selectMyMerchantState = (state) => state.myMerchant || initialState;

export const selectMerchant = createSelector(selectMyMerchantState, (state) => state.merchant);

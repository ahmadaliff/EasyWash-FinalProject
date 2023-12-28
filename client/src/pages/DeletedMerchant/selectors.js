import { createSelector } from 'reselect';
import { initialState } from '@pages/DeletedMerchant/reducer';

const selectDeletedMerchantsState = (state) => state.deletedMerchants || initialState;

export const selectMerchants = createSelector(selectDeletedMerchantsState, (state) => state.merchants);

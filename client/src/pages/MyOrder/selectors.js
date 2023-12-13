import { createSelector } from 'reselect';

import { initialState } from '@pages/MyOrder/reducer';

const selectMyOrderState = (state) => state.myOrder || initialState;

export const selectMyOrder = createSelector(selectMyOrderState, (state) => state.orders);

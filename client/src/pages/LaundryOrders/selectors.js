import { createSelector } from 'reselect';
import { initialState } from '@pages/LaundryServices/reducer';

const selectLaundryOrdersState = (state) => state.laundryOrders || initialState;

export const selectOrders = createSelector(selectLaundryOrdersState, (state) => state.orders);

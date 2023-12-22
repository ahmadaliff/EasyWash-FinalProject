import { createSelector } from 'reselect';
import { initialState } from '@pages/StatusOrder/reducer';

const selectStatusOrderState = (state) => state.statusOrder || initialState;

export const selectOrder = createSelector(selectStatusOrderState, (state) => state.order);
export const selectSocket = createSelector(selectStatusOrderState, (state) => state.socket);

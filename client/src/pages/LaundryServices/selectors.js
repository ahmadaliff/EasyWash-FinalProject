import { createSelector } from 'reselect';
import { initialState } from '@pages/LaundryServices/reducer';

const selectServicesState = (state) => state.services || initialState;

export const selectServices = createSelector(selectServicesState, (state) => state.services);

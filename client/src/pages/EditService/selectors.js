import { createSelector } from 'reselect';

import { initialState as editServiceInitialState } from '@pages/EditService/reducer';

const selectServiceState = (state) => state.editService || editServiceInitialState;
export const selectService = createSelector(selectServiceState, (state) => state.service);

import { CHANGE_ENABLE_STATUS_SERVICE, GET_SERVICES, RESET_SERVICES, SET_SERVICES } from './constants';

export const actionGetServices = (search, limit, page) => ({
  type: GET_SERVICES,
  search,
  limit,
  page,
});

export const actionSetServices = (services) => ({
  type: SET_SERVICES,
  services,
});

export const actionStatusService = (id) => ({
  type: CHANGE_ENABLE_STATUS_SERVICE,
  id,
});

export const actionResetServices = () => ({
  type: RESET_SERVICES,
});

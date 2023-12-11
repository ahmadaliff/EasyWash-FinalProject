import { DELETE_SERVICE, GET_SERVICES, RESET_SERVICES, SET_SERVICES } from './constants';

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

export const actionDeleteService = (data) => ({
  type: DELETE_SERVICE,
  data,
});

export const actionResetServices = () => ({
  type: RESET_SERVICES,
});

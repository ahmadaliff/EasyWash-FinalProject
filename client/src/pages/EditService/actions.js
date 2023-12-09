import { EDIT_SERVICE, GET_SERVICE, RESET_SERVICE, SET_SERVICE } from './constants';

export const actionEditService = (id, data, callback) => ({
  type: EDIT_SERVICE,
  id,
  data,
  callback,
});

export const actionGetService = (id) => ({
  type: GET_SERVICE,
  id,
});

export const actionSetService = (data) => ({
  type: SET_SERVICE,
  data,
});

export const actionResetService = () => ({
  type: RESET_SERVICE,
});

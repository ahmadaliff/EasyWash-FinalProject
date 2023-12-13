import { CREATE_ORDER, RESET_ORDER, SET_ORDER } from './constants';

export const actionSetOrder = (data) => ({
  type: SET_ORDER,
  data,
});

export const actionCreateOrder = (data, callback) => ({
  type: CREATE_ORDER,
  data,
  callback,
});

export const actionResetOrder = () => ({
  type: RESET_ORDER,
});

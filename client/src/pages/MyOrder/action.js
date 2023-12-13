import { CANCEL_ORDER, GET_ORDERS, RESET_ORDERS, SET_ORDERS } from './constants';

export const actionGetMyOrder = () => ({
  type: GET_ORDERS,
});

export const actionSetMyOrder = (data) => ({
  type: SET_ORDERS,
  data,
});

export const actionResetMyOrder = () => ({
  type: RESET_ORDERS,
});

export const actionCancelOrder = (id, callback) => ({
  type: CANCEL_ORDER,
  id,
  callback,
});

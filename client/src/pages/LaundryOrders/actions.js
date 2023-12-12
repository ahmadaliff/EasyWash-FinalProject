import { CHANGE_STATUS, GET_ORDERS, RESET_ORDERS, SET_ORDERS } from './constants';

export const actionGetOrders = (limit, page) => ({
  type: GET_ORDERS,
  limit,
  page,
});

export const actionSetOrders = (orders) => ({
  type: SET_ORDERS,
  orders,
});

export const actionChangeStatus = (id, newStatus) => ({
  type: CHANGE_STATUS,
  id,
  newStatus,
});

export const actionResetOrders = () => ({
  type: RESET_ORDERS,
});

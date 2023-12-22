import { ADD_TO_CART, CHANGE_QUANTITY, DELETE_FROM_CART, GET_CARTS, RESET_CARTS, SET_CARTS } from './constants';

export const actionGetCarts = () => ({
  type: GET_CARTS,
});

export const actionSetCarts = (data) => ({
  type: SET_CARTS,
  data,
});

export const actionResetCarts = () => ({
  type: RESET_CARTS,
});

export const actionChangeQuantity = (id, quantity) => ({
  type: CHANGE_QUANTITY,
  id,
  quantity,
});

export const actionAddToCart = (id, quantity) => ({
  type: ADD_TO_CART,
  id,
  quantity,
});

export const actionDeleteFromCart = (id) => ({
  type: DELETE_FROM_CART,
  id,
});

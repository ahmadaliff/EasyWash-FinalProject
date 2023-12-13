import { GET_MERCHANT, RESET_MERCHANT, SET_MERCHANT } from './constants';

export const actionGetMerchant = (id) => ({
  type: GET_MERCHANT,
  id,
});

export const actionSetMerchant = (data) => ({
  type: SET_MERCHANT,
  data,
});

export const actionResetMerchant = () => ({
  type: RESET_MERCHANT,
});

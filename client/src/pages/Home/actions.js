import { GET_MERCHANTS, RESET_MERCHANTS, SET_MERCHANTS } from './constants';

export const actionGetMerchants = () => ({
  type: GET_MERCHANTS,
});

export const actionSetMerchants = (data) => ({
  type: SET_MERCHANTS,
  data,
});

export const actionResetMerchants = () => ({
  type: RESET_MERCHANTS,
});

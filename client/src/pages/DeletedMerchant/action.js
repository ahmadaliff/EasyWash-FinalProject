import { GET_DELETED_MERCHANTS, RESET_DELETED_MERCHANTS, SET_DELETED_MERCHANTS } from './constants';

export const actionGetDeletedMerchants = () => ({
  type: GET_DELETED_MERCHANTS,
});

export const actionSetDeletedMerchants = (data) => ({
  type: SET_DELETED_MERCHANTS,
  data,
});

export const actionResetDeletedMerchants = () => ({
  type: RESET_DELETED_MERCHANTS,
});

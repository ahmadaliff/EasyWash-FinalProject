import {
  SET_MERCHANT,
  GET_MERCHANT,
  RESET_MERCHANT,
  CHANGE_PHOTO_MERCHANT,
  EDIT_MERCHANT,
} from '@pages/MyMerchant/constants';

export const actionGetMerchant = () => ({
  type: GET_MERCHANT,
});

export const actionSetMerchant = (merchant) => ({
  type: SET_MERCHANT,
  merchant,
});

export const actionResetMerchant = () => ({
  type: RESET_MERCHANT,
});

export const actionEditPhotoMerchant = (data) => ({
  type: CHANGE_PHOTO_MERCHANT,
  data,
});
export const actionEditMerchant = (data) => ({
  type: EDIT_MERCHANT,
  data,
});

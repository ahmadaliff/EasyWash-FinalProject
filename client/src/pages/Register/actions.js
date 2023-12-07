import { RESET_STEP, SET_EMAIL, SET_EXPIRE_TIME, SET_MERCHANT, SET_ROLE, SET_STEP } from './constants';

export const actionSetStep = (step) => ({
  type: SET_STEP,
  step,
});
export const actionSetEmail = (email) => ({
  type: SET_EMAIL,
  email,
});
export const actionSetRole = (role) => ({
  type: SET_ROLE,
  role,
});
export const actionSetMerchant = (merchant) => ({
  type: SET_MERCHANT,
  merchant,
});
export const actionSetExpire = (expire) => ({
  type: SET_EXPIRE_TIME,
  expire,
});
export const actionHandleResetStep = () => ({
  type: RESET_STEP,
});

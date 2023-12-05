import { RESET_STEP, SET_EMAIL, SET_EXPIRE_TIME, SET_STEP } from './constants';

export const actionSetStep = (step) => ({
  type: SET_STEP,
  step,
});
export const actionSetEmail = (email) => ({
  type: SET_EMAIL,
  email,
});
export const actionSetExpire = (expire) => ({
  type: SET_EXPIRE_TIME,
  expire,
});
export const actionHandleResetStep = () => ({
  type: RESET_STEP,
});

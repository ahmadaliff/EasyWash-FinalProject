import {
  ADD_CHANNEL,
  GET_PROFILE,
  GET_TOKEN_STREAM,
  GET_USERS,
  RESET_PROFILE,
  RESET_USERS,
  SET_PROFILE,
  SET_TOKEN_STREAM,
  SET_USERS,
} from './constants';

export const actionGetProfile = () => ({
  type: GET_PROFILE,
});
export const actionSetProfile = (profile) => ({
  type: SET_PROFILE,
  profile,
});
export const actionResetProfile = () => ({
  type: RESET_PROFILE,
});
export const actionGetTokenMessage = () => ({
  type: GET_TOKEN_STREAM,
});
export const actionSetTokenMessage = (token) => ({
  type: SET_TOKEN_STREAM,
  token,
});
export const actionAddChannel = (otherUserId) => ({
  type: ADD_CHANNEL,
  otherUserId,
});
export const actionGetUsersAvailable = () => ({
  type: GET_USERS,
});
export const actionSetUsersAvailable = (users) => ({
  type: SET_USERS,
  users,
});
export const actionResetUsersAvailable = () => ({
  type: RESET_USERS,
});

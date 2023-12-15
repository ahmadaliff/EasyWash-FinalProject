import { ADD_CHANNEL, DELETE_CHANNEL, GET_TOKEN_STREAM, RESET_TOKEN_STREAM, SET_TOKEN_STREAM } from './constants';

export const actionGetTokenMessage = () => ({
  type: GET_TOKEN_STREAM,
});

export const actionSetTokenMessage = (token) => ({
  type: SET_TOKEN_STREAM,
  token,
});

export const actionAddChannel = (otherUserId, callback) => ({
  type: ADD_CHANNEL,
  otherUserId,
  callback,
});

export const actionDeleteChannel = (otherUserId) => ({
  type: DELETE_CHANNEL,
  otherUserId,
});

export const actionResetTokenMessage = () => ({
  type: RESET_TOKEN_STREAM,
});

import { CONNECT_SOCKET, DISCONNECT_SOCKET, GET_STATUS, SET_STATUS, WATCH_STATUS_UPDATES } from './constants';

export const actionGetStatus = (orderId) => ({
  type: GET_STATUS,
  orderId,
});
export const actionSetStatus = (data) => ({
  type: SET_STATUS,
  data,
});
export const actionStatusUpdated = (data) => ({
  type: GET_STATUS,
  data,
});
export const actionConnectSocket = (orderId) => ({
  type: CONNECT_SOCKET,
  orderId,
});

export const actionDisconnectSocket = (orderId) => ({
  type: DISCONNECT_SOCKET,
  orderId,
});

export const watchStatusUpdates = () => ({
  type: WATCH_STATUS_UPDATES,
});

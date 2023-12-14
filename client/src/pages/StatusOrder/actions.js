import {
  CONNECTED_SOCKET,
  CONNECT_SOCKET,
  DISCONNECT_SOCKET,
  GET_STATUS,
  PAY,
  SET_STATUS,
  STATUS_UPDATED,
  WATCH_STATUS_UPDATES,
} from './constants';

export const actionGetStatus = (orderId) => ({
  type: GET_STATUS,
  orderId,
});

export const actionSetStatus = (data) => ({
  type: SET_STATUS,
  data,
});

export const actionStatusUpdated = (data) => ({
  type: STATUS_UPDATED,
  data,
});

export const actionConnectSocket = () => ({
  type: CONNECT_SOCKET,
});

export const actionConnectedSocket = (data) => ({
  type: CONNECTED_SOCKET,
  data,
});

export const actionDisconnectSocket = () => ({
  type: DISCONNECT_SOCKET,
});

export const watchStatusUpdates = (orderId) => ({
  type: WATCH_STATUS_UPDATES,
  orderId,
});

export const actionPay = (orderId) => ({
  type: PAY,
  orderId,
});

import { call, put, takeEvery } from 'redux-saga/effects';
import { eventChannel } from 'redux-saga';
import toast from 'react-hot-toast';
import io from 'socket.io-client';

import intlHelper from '@utils/intlHelper';

import { CONNECT_SOCKET, DISCONNECT_SOCKET, GET_STATUS, WATCH_STATUS_UPDATES } from '@pages/StatusOrder/constants';
import { showPopup } from '@containers/App/actions';
import { actionSetStatus, actionStatusUpdated } from '@pages/StatusOrder/actions';
import { apiGetOrderById } from '@domain/api';
import config from '@config/index';

const createSocketChannel = (socket) =>
  eventChannel((emit) => {
    const handler = (data) => emit(data);
    socket.on('statusUpdated', handler);

    return () => {
      socket.off('statusUpdated', handler);
    };
  });

function* connectSocket({ orderId }) {
  const socket = yield call(io, `${config.api.server}/user/${orderId}`);
  yield put({ type: 'SOCKET_CONNECTED', socket });
}

function* disconnectSocket({ orderId }) {
  const socket = yield call(io, `${config.api.server}/user/${orderId}`);
  if (socket) {
    socket.disconnect();
  }
}

function* sagaGetStatus({ orderId }) {
  try {
    const response = yield call(apiGetOrderById, orderId);
    yield put(actionSetStatus(response.data));
  } catch (error) {
    if (error?.response?.status === 400 || error?.response?.status === 404) {
      toast.error(intlHelper({ message: error.response.data.message }));
    } else {
      yield put(showPopup());
    }
  }
}

function* handleStatusUpdate(payload) {
  yield put(actionStatusUpdated(payload));
}

function* watchStatusUpdates({ orderId }) {
  const socket = yield call(io, `${config.api.server}/user/${orderId}`);
  const channel = yield call(createSocketChannel, socket);
  yield takeEvery(channel, handleStatusUpdate);
}

export function* statusOrderSaga() {
  yield takeEvery(GET_STATUS, sagaGetStatus);
  yield takeEvery(CONNECT_SOCKET, connectSocket);
  yield takeEvery(DISCONNECT_SOCKET, disconnectSocket);
  yield takeEvery(WATCH_STATUS_UPDATES, watchStatusUpdates);
}

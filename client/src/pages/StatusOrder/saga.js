import { call, put, select, takeLatest } from 'redux-saga/effects';
import { eventChannel } from 'redux-saga';
import toast from 'react-hot-toast';
import io from 'socket.io-client';

import intlHelper from '@utils/intlHelper';

import { apiGetOrderById, apiGetTokenMidtrans, apiPaymentSuccess } from '@domain/api';

import config from '@config/index';

import { CONNECT_SOCKET, DISCONNECT_SOCKET, GET_STATUS, PAY, WATCH_STATUS_UPDATES } from '@pages/StatusOrder/constants';
import { setLoading, showPopup } from '@containers/App/actions';
import { actionConnectedSocket, actionSetStatus, actionStatusUpdated } from '@pages/StatusOrder/actions';
import { selectSocket } from '@pages/StatusOrder/selectors';
import { selectLocale } from '@containers/App/selectors';

const createSocketChannel = (socket, orderId) =>
  eventChannel((emit) => {
    const handler = (data) => emit(data);
    socket.on(`statusUpdated/${orderId}`, handler);
    return () => {
      socket.off(`statusUpdated/${orderId}`, handler);
    };
  });

function* connectSocket() {
  const socket = yield call(io, `${config.api.server}`);
  yield put(actionConnectedSocket(socket));
}

function* disconnectSocket() {
  const socket = yield call(io, `${config.api.server}`);
  if (socket) {
    socket.disconnect();
  }
}

function* sagaGetStatus({ orderId }) {
  yield put(setLoading(true));
  try {
    const response = yield call(apiGetOrderById, orderId);
    yield put(actionSetStatus(response.data));
  } catch (error) {
    if (error?.response?.status === 400 || error?.response?.status === 404 || error?.response?.status === 401) {
      toast.error(intlHelper({ message: error.response.data.message }));
    } else {
      yield put(showPopup());
    }
  }
  yield put(setLoading(false));
}

function* sagaHandlePay({ orderId }) {
  yield put(setLoading(true));
  try {
    const response = yield call(apiGetTokenMidtrans, orderId);
    const language = yield select(selectLocale);
    window.snap.pay(response.token, {
      onSuccess(result) {
        toast.success(result.transaction_status);
        apiPaymentSuccess(orderId);
      },
      onPending(result) {
        toast(result.transaction_status);
      },
      language,
    });
  } catch (error) {
    if (error?.response?.status === 400 || error?.response?.status === 404 || error?.response?.status === 401) {
      toast.error(intlHelper({ message: error.response.data.message }));
    } else {
      yield put(showPopup());
    }
  }

  yield put(setLoading(false));
}

function* sagaHandleStatusUpdate(payload) {
  yield put(actionStatusUpdated(payload));
  toast.success(intlHelper({ message: 'app_status_updated' }));
}

function* sagaWatchStatusUpdates({ orderId }) {
  const socket = yield select(selectSocket);
  if (socket) {
    const channel = yield call(createSocketChannel, socket, orderId);
    yield takeLatest(channel, sagaHandleStatusUpdate);
  }
}

export default function* statusOrderSaga() {
  yield takeLatest(GET_STATUS, sagaGetStatus);
  yield takeLatest(CONNECT_SOCKET, connectSocket);
  yield takeLatest(DISCONNECT_SOCKET, disconnectSocket);
  yield takeLatest(WATCH_STATUS_UPDATES, sagaWatchStatusUpdates);
  yield takeLatest(PAY, sagaHandlePay);
}

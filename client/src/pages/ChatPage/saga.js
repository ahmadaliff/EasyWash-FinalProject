import toast from 'react-hot-toast';
import { takeLatest, call, put } from 'redux-saga/effects';

import { apiHandleAddChannel, apiHandleDeleteChannel, apiHandleGetTokenStream } from '@domain/api';

import intlHelper from '@utils/intlHelper';

import { showPopup, setLoading } from '@containers/App/actions';
import { actionSetTokenMessage } from '@pages/ChatPage/actions';
import { ADD_CHANNEL, DELETE_CHANNEL, GET_TOKEN_STREAM } from '@pages/ChatPage/constants';

function* sagaHandleGetTokenStream() {
  yield put(setLoading(true));
  try {
    const response = yield call(apiHandleGetTokenStream);
    yield put(actionSetTokenMessage(response.token));
  } catch (error) {
    if (error?.response?.status === 400 || error?.response?.status === 404) {
      toast.error(intlHelper({ message: error.response.data.message }));
    } else {
      yield put(showPopup());
    }
  }
  yield put(setLoading(false));
}

function* sagaHandleAddChannel({ otherUserId, callback }) {
  yield put(setLoading(true));
  try {
    const response = yield call(apiHandleAddChannel, { userId: otherUserId });
    if (response?.message) {
      toast.success(intlHelper({ message: response.message }));
    }
    if (callback) {
      yield call(callback);
    }
  } catch (error) {
    if (error?.response?.status === 400 || error?.response?.status === 404) {
      toast.error(intlHelper({ message: error.response.data.message }));
    } else {
      yield put(showPopup());
    }
  }
  yield put(setLoading(false));
}

function* sagaHandleDeleteChannel({ otherUserId }) {
  yield put(setLoading(true));
  try {
    yield call(apiHandleDeleteChannel, { userId: otherUserId });
  } catch (error) {
    if (error?.response?.status === 400 || error?.response?.status === 404) {
      toast.error(intlHelper({ message: error.response.data.message }));
    } else {
      yield put(showPopup());
    }
  }
  yield put(setLoading(false));
}

export default function* MessageSaga() {
  yield takeLatest(GET_TOKEN_STREAM, sagaHandleGetTokenStream);
  yield takeLatest(ADD_CHANNEL, sagaHandleAddChannel);
  yield takeLatest(DELETE_CHANNEL, sagaHandleDeleteChannel);
}

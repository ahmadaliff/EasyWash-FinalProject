import toast from 'react-hot-toast';
import { takeLatest, call, put } from 'redux-saga/effects';

import {
  apiHandleAddChannel,
  apiHandleGetProfile,
  apiHandleGetTokenStream,
  apiHandleGetUsersAvailable,
} from '@domain/api';

import { showPopup, setLoading } from '@containers/App/actions';
import { actionSetProfile, actionSetTokenMessage, actionSetUsersAvailable } from '@pages/ChatPage/actions';
import { GET_TOKEN_STREAM, GET_PROFILE, ADD_CHANNEL, GET_USERS } from '@pages/ChatPage/constants';

function* sagaHandleGetUser() {
  yield put(setLoading(true));
  try {
    const response = yield call(apiHandleGetProfile);
    yield put(actionSetProfile(response.data));
  } catch (error) {
    if (error?.response?.status === 400 || error?.response?.status === 404) {
      toast.error(error.response.data.message);
    } else {
      yield put(showPopup());
    }
  }
  yield put(setLoading(false));
}

function* sagaHandleGetTokenStream() {
  yield put(setLoading(true));
  try {
    const response = yield call(apiHandleGetTokenStream);
    yield put(actionSetTokenMessage(response.token));
  } catch (error) {
    if (error?.response?.status === 400 || error?.response?.status === 404) {
      toast.error(error.response.data.message);
    } else {
      yield put(showPopup());
    }
  }
  yield put(setLoading(false));
}
function* sagaHandleGetUsersAvailable() {
  yield put(setLoading(true));
  try {
    const response = yield call(apiHandleGetUsersAvailable);
    yield put(actionSetUsersAvailable(response.data));
  } catch (error) {
    if (error?.response?.status === 400 || error?.response?.status === 404) {
      toast.error(error.response.data.message);
    } else {
      yield put(showPopup());
    }
  }
  yield put(setLoading(false));
}
function* sagaHandleAddChannel({ otherUserId }) {
  yield put(setLoading(true));
  try {
    yield call(apiHandleAddChannel, { userId: otherUserId });
  } catch (error) {
    if (error?.response?.status === 400 || error?.response?.status === 404) {
      toast.error(error.response.data.message);
    } else {
      yield put(showPopup());
    }
  }
  yield put(setLoading(false));
}

export default function* MessageSaga() {
  yield takeLatest(GET_PROFILE, sagaHandleGetUser);
  yield takeLatest(GET_TOKEN_STREAM, sagaHandleGetTokenStream);
  yield takeLatest(GET_USERS, sagaHandleGetUsersAvailable);
  yield takeLatest(ADD_CHANNEL, sagaHandleAddChannel);
}

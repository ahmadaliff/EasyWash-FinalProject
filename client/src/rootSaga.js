import { all } from 'redux-saga/effects';

import appSaga from '@containers/App/saga';
import clientSaga from '@containers/Client/saga';
import profileSaga from '@pages/Profile/saga';
import usersSaga from '@pages/Users/saga';

export default function* rootSaga() {
  yield all([appSaga(), clientSaga(), profileSaga(), usersSaga()]);
}

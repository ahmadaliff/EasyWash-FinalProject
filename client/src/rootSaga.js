import { all } from 'redux-saga/effects';

import appSaga from '@containers/App/saga';
import clientSaga from '@containers/Client/saga';
import profileSaga from '@pages/Profile/saga';

export default function* rootSaga() {
  yield all([appSaga(), clientSaga(), profileSaga()]);
}

import { all } from 'redux-saga/effects';

import deviceSaga from './modules/devices/sagas';
import permissionsSaga from './modules/permissions/sagas';

export default function* rootSaga() {
  yield all([
    deviceSaga(),
    permissionsSaga(),
  ]);
}

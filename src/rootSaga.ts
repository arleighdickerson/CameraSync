import { all } from 'redux-saga/effects';

import deviceSaga from './modules/devices/sagas';

export default function* rootSaga() {
  yield all([
    deviceSaga(),
  ]);
}

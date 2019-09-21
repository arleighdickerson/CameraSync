import { all } from 'redux-saga/effects';
import initializeDevices from './initializeDevices';

export default function* deviceSaga() {
  yield all([
    initializeDevices(),
  ]);
}

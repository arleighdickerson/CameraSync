import { all } from 'redux-saga/effects';
import initializeDevices from './initializeDevices';
import { DeviceDuck } from '../duck';

export default function* deviceSaga(duck: DeviceDuck) {
  yield all([
    initializeDevices(duck),
  ]);
}

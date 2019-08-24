import { all, fork, put, takeEvery } from 'redux-saga/effects';
import * as deviceActions from '..';

const { INIT_DEVICE_LIST } = deviceActions.actionTypes;

import { NativeModules } from 'react-native';

const { Devices } = NativeModules;


function* fetchDevices() {
  const deviceList = yield Devices.fetchAll();
  yield put(deviceActions.attachAll(deviceList));
}

function* watchReduxInit() {
  yield takeEvery(INIT_DEVICE_LIST, fetchDevices);
}

export default function* initializeDevices() {
  yield all([
    fork(watchReduxInit),
  ]);
}

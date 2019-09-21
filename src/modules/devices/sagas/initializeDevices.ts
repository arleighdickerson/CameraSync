import { all, fork, put, takeEvery } from 'redux-saga/effects';
import * as deviceActions from '..';

import { container } from 'src/ioc';
import { getToken } from 'inversify-token';
import * as TYPES from 'src/types';

const { INIT_DEVICE_LIST } = deviceActions.actionTypes;

function* fetchDevices() {
  const deviceSource = getToken(container, TYPES.DeviceSource);
  const deviceList = yield deviceSource.fetchAll();
  yield put(deviceActions.attachAll(deviceList));
}

function* watchDeviceListInit() {
  yield takeEvery(INIT_DEVICE_LIST, fetchDevices);
}

export default function* initializeDevices() {
  yield all([
    fork(watchDeviceListInit),
  ]);
}

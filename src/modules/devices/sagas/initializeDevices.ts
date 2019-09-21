import { select, all, fork, put, takeEvery } from 'redux-saga/effects';

import { container } from 'ioc';
import { getToken } from 'inversify-token';
import * as TYPES from 'types';
import * as deviceModule from '..';

function* fetchDevices() {
  const deviceSource = getToken(container, TYPES.DeviceSource);
  const deviceList = yield deviceSource.fetchAll();
  yield put(deviceModule.attachAll(deviceList));
}

function* watchDeviceListInit() {
  yield takeEvery(deviceModule.actionTypes.INIT_DEVICE_LIST, fetchDevices);
}

function* init() {
  const devices = yield select(state => state.devices);
  if (!devices) {
    yield put(deviceModule.initDeviceList());
  }
}

export default function* initializeDevices() {
  yield all([
    fork(watchDeviceListInit),
    fork(init),
  ]);
}

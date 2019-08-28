import { all, fork, put, takeEvery } from 'redux-saga/effects';
import { ActionType } from 'typesafe-actions';
import * as permissionActions from '..';
import * as deviceActions from '../../devices';

const { forgetDevice, forgetAllDevices } = permissionActions;
const { detach } = deviceActions;
const { DETACH_DEVICE, DETACH_ALL_DEVICES } = deviceActions.actionTypes;

function* forgetDeviceAuthorization(action: ActionType<typeof detach>) {
  yield put(forgetDevice(action.payload.deviceName));
}

function* watchForDetachedDevice() {
  yield takeEvery(DETACH_DEVICE, forgetDeviceAuthorization);
}

function* forgetAllDeviceAuthorizations() {
  yield put(forgetAllDevices());
}

function* watchForAllDevicesDetached() {
  yield takeEvery(DETACH_ALL_DEVICES, forgetAllDeviceAuthorizations);
}

export default function* forgetDevicesOnDisconnect() {
  yield all([
    fork(watchForDetachedDevice),
    fork(watchForAllDevicesDetached),
  ]);
}

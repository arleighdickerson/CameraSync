import { all, fork, put, takeEvery } from 'redux-saga/effects';
import { ActionType } from 'typesafe-actions';

import {
  forgetDevice,
  forgetAllDevices,
  actionTypes as permissionTypes,
} from 'modules/permissions';
import { detach, actionTypes as deviceTypes } from 'modules/devices';

function* forgetDeviceAuthorization(action: ActionType<typeof detach>) {
  yield put(forgetDevice(action.payload.deviceName));
}

function* watchForDetachedDevice() {
  yield takeEvery(deviceTypes.DETACH_DEVICE, forgetDeviceAuthorization);
}

function* forgetAllDeviceAuthorizations() {
  yield put(forgetAllDevices());
}

function* watchForAllDevicesDetached() {
  yield takeEvery(deviceTypes.DETACH_ALL_DEVICES, forgetAllDeviceAuthorizations);
}

export default function* forgetDevicesOnDisconnect() {
  yield all([
    fork(watchForDetachedDevice),
    fork(watchForAllDevicesDetached),
  ]);
}

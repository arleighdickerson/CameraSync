import {
  all,
  fork,
  takeEvery,
  getContext,
  select,
  put,
} from 'redux-saga/effects';
import { getToken } from 'inversify-token';
import * as TYPES from 'types';
import { getActiveDevice } from 'modules/devices/selectors';

import * as permissionActions from 'modules/permissions/actions';
import { DeviceInfo } from 'modules/devices/models';

function* startScan() {
  const container = yield getContext('container');
  const activeDevice: DeviceInfo = yield select(getActiveDevice);
  console.log(activeDevice);

  if (activeDevice === null) {
    console.error('asasdf');
  } else {
    const perm = yield put(permissionActions.requestDevice(activeDevice.deviceName));
    const mtpSource = getToken(container, TYPES.MtpSource);
    const info = yield mtpSource.scan();

    console.log(info);
  }
}

function* watchForScanRequests() {
  yield takeEvery('SCAN', startScan);
}

export default function* imageScan() {
  yield all([
    fork(watchForScanRequests),
  ]);
}

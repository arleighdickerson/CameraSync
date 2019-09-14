import { all, fork, put, takeEvery } from 'redux-saga/effects';
import { PermissionDuck } from 'src/modules/permissions';
// import * as deviceActions from 'src/modules/devices';


export default function createSaga(duck: PermissionDuck) {

  const { forgetDevice, forgetAllDevices } = duck.creators;
  const { DETACH_DEVICE, DETACH_ALL_DEVICES } = duck.deviceDuck.types;

  function* forgetDeviceAuthorization(action: any) {
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

  return function* forgetDevicesOnDisconnect() {
    yield all([
      fork(watchForDetachedDevice),
      fork(watchForAllDevicesDetached),
    ]);
  };
}

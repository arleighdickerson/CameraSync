import { all, fork, put, takeEvery } from 'redux-saga/effects';
import { DeviceDuck } from '../duck';

export default function createSaga(duck: DeviceDuck) {
  function* fetchDevices() {
    const deviceList = yield duck.deviceSource.fetchAll();
    yield put(duck.creators.attachAll(deviceList));
  }

  function* watchDeviceListInit() {
    yield takeEvery(duck.types.INIT_DEVICE_LIST, fetchDevices);
  }

  return function* initializeDevices() {
    yield all([
      fork(watchDeviceListInit),
    ]);
  };
}

import { all, fork, put, takeEvery } from 'redux-saga/effects';
import { PermissionDuck } from 'src/modules/permissions';


export default function createSaga(duck: PermissionDuck) {
  function* requestDeviceAuthorization(action: any) {
    const { deviceName } = action.payload;
    const wasGranted = yield duck.creators.requestDevice(deviceName);
    const { deviceGranted, deviceDenied } = duck.creators;
    const createAction = wasGranted ? deviceGranted : deviceDenied;
    yield put(createAction(deviceName));
  }

  function* watchDeviceRequests() {
    yield takeEvery(duck.types.REQUEST_DEVICE, requestDeviceAuthorization);
  }

  return function* deviceAuthorization() {
    yield all([
      fork(watchDeviceRequests),
    ]);
  };
}

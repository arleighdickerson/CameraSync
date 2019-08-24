import { all, fork, put, takeEvery } from 'redux-saga/effects';
import { ActionType } from 'typesafe-actions';
import { NativeModules } from 'react-native';
import * as permissionActions from '..';

const { Permissions } = NativeModules;
const { REQUEST_DEVICE } = permissionActions.actionTypes;
const { requestDevice, deviceGranted, deviceDenied } = permissionActions;

function* requestDeviceAuthorization(action: ActionType<typeof requestDevice>) {
  const { deviceName } = action.payload;
  const wasGranted = yield Permissions.authorizeDevice(deviceName);
  const createAction = wasGranted ? deviceGranted : deviceDenied;
  yield put(createAction(deviceName));
}

function* watchDeviceRequests() {
  yield takeEvery(REQUEST_DEVICE, requestDeviceAuthorization);
}

export default function* deviceAuthorization() {
  yield all([
    fork(watchDeviceRequests),
  ]);
}

import { all, fork, put, takeEvery } from 'redux-saga/effects';
import { ActionType } from 'typesafe-actions';
import { container } from 'src/ioc';
import { getToken } from 'inversify-token';
import * as TYPES from 'src/types';
import * as permissionActions from '..';

const { REQUEST_DEVICE } = permissionActions.actionTypes;
const { requestDevice, deviceGranted, deviceDenied } = permissionActions;

function* requestDeviceAuthorization(action: ActionType<typeof requestDevice>) {
  const { deviceName } = action.payload;
  const permissionSource = getToken(container, TYPES.PermissionSource);
  const wasGranted = yield permissionSource.authorizeDevice(deviceName);
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

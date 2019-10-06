import { all, fork, getContext, put, takeEvery } from 'redux-saga/effects';
import { ActionType } from 'typesafe-actions';
import { getToken } from 'inversify-token';
import * as TYPES from 'types';
import {
  requestDevice,
  deviceGranted,
  deviceDenied,
  actionTypes,
} from '../actions';

function* requestDeviceAuthorization(action: ActionType<typeof requestDevice>) {
  const { deviceName } = action.payload;
  const container = yield getContext('container');
  const permissionSource = getToken(container, TYPES.PermissionSource);
  const wasGranted = yield permissionSource.authorizeDevice(deviceName);
  const createAction = wasGranted ? deviceGranted : deviceDenied;
  yield put(createAction(deviceName));
}

function* watchDeviceRequests() {
  yield takeEvery(actionTypes.REQUEST_DEVICE, requestDeviceAuthorization);
}

export default function* deviceAuthorization() {
  yield all([
    fork(watchDeviceRequests),
  ]);
}

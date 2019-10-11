import { all, fork, getContext, put, takeEvery } from 'redux-saga/effects';
import { getToken } from 'inversify-token';
import * as TYPES from 'types';
import { actionTypes, devicePermissionDenied, devicePermissionGranted } from '../actions';

function* requestDeviceAuthorization() {
  const container = yield getContext('container');
  const mtpSource = getToken(container, TYPES.MtpSource);
  const wasGranted = yield mtpSource.requestDevicePermission();
  const createAction = wasGranted ? devicePermissionGranted : devicePermissionDenied;
  yield put(createAction());
}

function* watchDeviceRequests() {
  yield takeEvery(actionTypes.REQUEST_DEVICE_PERMISSION, requestDeviceAuthorization);
}

export default function* authorizeDevice() {
  yield all([
    fork(watchDeviceRequests),
  ]);
}

import { all, fork, getContext, put, takeEvery } from 'redux-saga/effects';
import { getToken } from 'inversify-token';
import * as TYPES from 'types';
import { actionTypes, storagePermissionDenied, storagePermissionGranted } from '../actions';

function* requestDeviceAuthorization() {
  const container = yield getContext('container');
  const mtpSource = getToken(container, TYPES.MtpSource);
  const wasGranted = yield mtpSource.requestStoragePermission();
  const createAction = wasGranted ? storagePermissionGranted : storagePermissionDenied;
  yield put(createAction());
}

function* watchDeviceRequests() {
  yield takeEvery(actionTypes.REQUEST_STORAGE_PERMISSION, requestDeviceAuthorization);
}

export default function* authorizeStorage() {
  yield all([
    fork(watchDeviceRequests),
  ]);
}

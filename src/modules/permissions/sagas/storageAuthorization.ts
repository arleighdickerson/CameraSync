import { all, fork, getContext, put, takeEvery } from 'redux-saga/effects';
import { getToken } from 'inversify-token';
import * as TYPES from 'types';
import { actionTypes, storageDenied, storageGranted } from '../actions';

function* requestStorageAuthorization() {
  const container = yield getContext('container');
  const permissionSource = getToken(container, TYPES.PermissionSource);
  const wasGranted = yield permissionSource.authorizeStorage();
  const createAction = wasGranted ? storageGranted : storageDenied;
  yield put(createAction());
}

function* watchStorageRequests() {
  yield takeEvery(actionTypes.REQUEST_STORAGE, requestStorageAuthorization);
}

export default function* storageAuthorization() {
  yield all([
    fork(watchStorageRequests),
  ]);
}

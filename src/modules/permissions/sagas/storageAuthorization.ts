import { all, fork, put, takeEvery } from 'redux-saga/effects';
import { getToken } from 'inversify-token';
import { container } from 'src/ioc';
import * as TYPES from 'src/types';
import * as permissionActions from '..';

const { REQUEST_STORAGE } = permissionActions.actionTypes;

const { storageDenied, storageGranted } = permissionActions;

function* requestStorageAuthorization() {
  const permissionSource = getToken(container, TYPES.PermissionSource);
  const wasGranted = yield permissionSource.authorizeStorage();
  const createAction = wasGranted ? storageGranted : storageDenied;
  yield put(createAction());
}

function* watchStorageRequests() {
  yield takeEvery(REQUEST_STORAGE, requestStorageAuthorization);
}

export default function* storageAuthorization() {
  yield all([
    fork(watchStorageRequests),
  ]);
}

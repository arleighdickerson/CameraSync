import { all, fork, put, takeEvery } from 'redux-saga/effects';
import { NativeModules } from 'react-native';
import * as permissionActions from '..';

const { Permissions } = NativeModules;
const { REQUEST_STORAGE } = permissionActions.actionTypes;

const { storageDenied, storageGranted } = permissionActions;

function* requestStorageAuthorization() {
  const wasGranted = yield Permissions.authorizeStorage();
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

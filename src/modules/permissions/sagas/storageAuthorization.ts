import { all, fork, put, takeEvery } from 'redux-saga/effects';
import { PermissionDuck } from 'src/modules/permissions';

export default function createSaga(duck: PermissionDuck) {
  const { storageDenied, storageGranted } = duck.creators;
  const { REQUEST_STORAGE } = duck.types;
  const source = duck.permissionSource;

  function* requestStorageAuthorization() {
    const wasGranted = yield source.authorizeStorage();
    const createAction = wasGranted ? storageGranted : storageDenied;
    yield put(createAction());
  }

  function* watchStorageRequests() {
    yield takeEvery(REQUEST_STORAGE, requestStorageAuthorization);
  }

  return function* storageAuthorization() {
    yield all([
      fork(watchStorageRequests),
    ]);
  };
}

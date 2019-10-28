import { all, fork, getContext, takeEvery, put } from 'redux-saga/effects';
import { getToken } from 'inversify-token';
import * as TYPES from 'types';
import * as actions from '../actions';

function* scan() {
  const container = yield getContext('container');
  const mtpSource = getToken(container, TYPES.MtpSource);
  try {
    const results = yield mtpSource.scanObjectHandles();
    yield put(actions.scanObjectsAsync.success(results));
    console.log(results);
  } catch (e) {
    yield put(actions.scanObjectsAsync.failure(e));
    console.error(e);
  }
  // yield put(createAction());
}

function* watchForUserToRequestToScanObjectHandles() {
  yield takeEvery(actions.scanObjectsAsync.request, scan);
}

export default function* scanObjectHandles() {
  yield all([
    fork(watchForUserToRequestToScanObjectHandles),
  ]);
}

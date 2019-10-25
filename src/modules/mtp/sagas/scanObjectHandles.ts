import { all, fork, getContext, put, takeEvery } from 'redux-saga/effects';
import { getToken } from 'inversify-token';
import * as TYPES from 'types';
import {
  actionTypes,
} from '../actions';

function* scanObjectHandles() {
  const container = yield getContext('container');
  const mtpSource = getToken(container, TYPES.MtpSource);
  try {
    const results = yield mtpSource.scanObjectHandles();
    console.log(results);
  } catch (e) {
    console.error(e);
  }
  // yield put(createAction());
}

function* watchForUserToRequestToScanObjectHandles() {
  yield takeEvery(actionTypes.REQUEST_OBJECT_HANDLE_SCAN, scanObjectHandles);
}

export default function* authorizeDevice() {
  yield all([
    fork(watchForUserToRequestToScanObjectHandles),
  ]);
}

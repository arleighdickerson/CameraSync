import {
  all,
  fork,
  takeEvery,
  getContext,
} from 'redux-saga/effects';
import { getToken } from 'inversify-token';
import * as TYPES from 'types';
import * as mtpActions from '../actions';

function* startScan() {
  const container = yield getContext('container');
  const mtpSource = getToken(container, TYPES.MtpSource);
  yield mtpSource.sync();
}

function* watchForScanRequests() {
  yield takeEvery('SCAN', startScan);
}

export default function* imageScan() {
  yield all([
    fork(watchForScanRequests),
  ]);
}

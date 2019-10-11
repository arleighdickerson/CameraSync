import {
  select,
  all,
  fork,
  put,
  takeEvery,
  getContext,
} from 'redux-saga/effects';
import { getToken } from 'inversify-token';
import * as TYPES from 'types';
import * as deviceActions from '../actions';

// import { purgeStoredState } from 'redux-persist';

function* fetchCurrentDevice() {
  const container = yield getContext('container');
  const deviceSource = getToken(container, TYPES.MtpSource);
  const deviceInfo = yield deviceSource.getDeviceInfo();

  if (deviceInfo != null) {
    yield put(deviceActions.attachDevice(deviceInfo));
  }
}

function* watchDeviceListInit() {
  yield takeEvery(deviceActions.actionTypes.INIT_DEVICE, fetchCurrentDevice);
}

function* init() {
  const device = yield select(state => state.device);

  if (!device) {
    yield put(deviceActions.initDevice());
  }
}

export default function* initializeDevices() {
  yield all([
    fork(watchDeviceListInit),
    fork(init),
  ]);
}

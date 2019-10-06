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

function* fetchDevices() {
  // !!! we can dispose of the singleton ioc container
  // will now scope to AppDependencies object !!!
  const container = yield getContext('container');
  const deviceSource = getToken(container, TYPES.DeviceSource);
  const deviceList = yield deviceSource.fetchAll();
  yield put(deviceActions.attachAll(deviceList));
}

function* watchDeviceListInit() {
  yield takeEvery(deviceActions.actionTypes.INIT_DEVICE_LIST, fetchDevices);
}
/*
function* watchPurge() {
  yield takeEvery('PURGE', function* () {
    const container = yield getContext('container');
    const { persistConfig } = getToken(container, TYPES.DependencyOptions);
    if (persistConfig) {
      purgeStoredState(persistConfig);
    }
  });
}
*/

function* init() {
  const devices = yield select(state => state.devices);
  if (!devices) {
    yield put(deviceActions.initDeviceList());
  }
}

export default function* initializeDevices() {
  yield all([
    fork(watchDeviceListInit),
    // fork(watchPurge),
    fork(init),
  ]);
}

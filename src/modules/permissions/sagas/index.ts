import { all } from 'redux-saga/effects';
import deviceAuthorization from './deviceAuthorization';
import storageAuthorization from './storageAuthorization';
import forgetDevicesOnDisconnect from './forgetDevicesOnDisconnect';

export default function* permissionsSaga() {
  yield all([
    deviceAuthorization(),
    storageAuthorization(),
    forgetDevicesOnDisconnect(),
  ]);
}

import { all } from 'redux-saga/effects';
import deviceAuthorization from './deviceAuthorization';
import storageAuthorization from './storageAuthorization';
import forgetDevicesOnDisconnect from './forgetDevicesOnDisconnect';
import { PermissionDuck } from '../';

export default function* permissionSaga(duck: PermissionDuck) {
  yield all([
    deviceAuthorization(duck),
    storageAuthorization(duck),
    forgetDevicesOnDisconnect(duck),
  ]);
}

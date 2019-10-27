import { createReducer } from 'typesafe-actions';
import * as actions from './actions';

import { DeviceInfo } from './models';

export type DeviceState = DeviceInfo | null

export default createReducer<DeviceState>(null)
  .handleAction(actions.attachDevice, (state, action) => {
    return { ...action.payload };
  })
  .handleAction(actions.detachDevice, () => {
    return null;
  })
  .handleAction(actions.devicePermissionDenied, (state) => {
    if (state !== null) {
      return { ...state, hasPermission: false };
    }
    return state;
  })
  .handleAction(actions.devicePermissionGranted, (state) => {

    if (state !== null) {
      return { ...state, hasPermission: true };
    }

    return state;
  });


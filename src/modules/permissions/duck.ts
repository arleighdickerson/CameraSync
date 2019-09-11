import * as TYPES from './sources/types';
import { PermissionSource } from './sources/PermissionSource';
import { Duck, DuckOptions } from 'saga-duck';
import * as redux from 'redux';
import { all, fork, put, takeEvery } from 'redux-saga/effects';
import getDecorators from 'inversify-inject-decorators';
import { container } from 'src/ioc';

const { lazyInject } = getDecorators(container);

type PermissionsState = {
    devices: { [key: string]: boolean }
    storage: boolean | null,
}

const initialState: PermissionsState = {
  devices: {},
  storage: null,
};

function cloneState(state: PermissionsState): PermissionsState {
  return {
    devices: { ...state.devices },
    storage: state.storage,
  };
}

const setStorage = (state: PermissionsState, storage: boolean | null) => ({
  ...cloneState(state),
  storage,
});

const setPermission = (state: PermissionsState, deviceName: string, value: boolean) => {
  const newState = cloneState(state);
  newState.devices[deviceName] = value;
  return newState;
};

export class PermissionDuck extends Duck {
    @lazyInject(TYPES.PermissionSource.identifier)
    // @ts-ignore
    public permissionSource: PermissionSource;

    get actionTypePrefix() {
      return 'permissions';
    }

    get quickTypes() {
      return {
        ...super.quickTypes,
        REQUEST_STORAGE:    1,
        STORAGE_GRANTED:    1,
        STORAGE_DENIED:     1,
        REQUEST_DEVICE:     1,
        DEVICE_GRANTED:     1,
        DEVICE_DENIED:      1,
        FORGET_DEVICE:      1,
        FORGET_ALL_DEVICES: 1,
      };
    }

    get creators() {
      const actionTypes = this.types;
      const createStorageAction = <T>(type: T): () => { type: T } => () => ({ type });
      const createDeviceAction = <T>(type: T) => (deviceName: string): { type: T, deviceName: string } => ({
        type,
        deviceName,
      });
      return {
        requestStorage:   createStorageAction(actionTypes.REQUEST_STORAGE),
        storageGranted:   createStorageAction(actionTypes.STORAGE_GRANTED),
        storageDenied:    createStorageAction(actionTypes.STORAGE_DENIED),
        requestDevice:    createDeviceAction(actionTypes.REQUEST_DEVICE),
        deviceGranted:    createDeviceAction(actionTypes.DEVICE_GRANTED),
        deviceDenied:     createDeviceAction(actionTypes.DEVICE_DENIED),
        forgetDevice:     createDeviceAction(actionTypes.FORGET_DEVICE),
        forgetAllDevices: () => ({ type: actionTypes.FORGET_ALL_DEVICES }),
      };
    }

    private get permissionReducer(): redux.Reducer {
      return (state: PermissionsState = initialState, action: any) => {
        const actionTypes = this.types;
        switch (action.type) {
        case actionTypes.STORAGE_DENIED: {
          return setStorage(state, false);
        }
        case actionTypes.STORAGE_GRANTED: {
          return setStorage(state, true);
        }
        case actionTypes.DEVICE_DENIED: {
          return setPermission(state, action.payload.deviceName, false);
        }
        case actionTypes.DEVICE_GRANTED: {
          return setPermission(state, action.payload.deviceName, true);
        }
        case actionTypes.FORGET_DEVICE: {
          const newState = cloneState(state);
          delete newState.devices[action.payload.deviceName];
          return newState;
        }
        case actionTypes.FORGET_ALL_DEVICES: {
          return { devices: {}, storage: state.storage };
        }
        default:
          return state;
        }
      };
    }

    get reducer() {
      return this.permissionReducer;
    }

    * saga() {
      yield* super.saga();

      // @see https://github.com/cyrilluce/saga-duck#single-duck

      const { permissionSource, types, creators } = this;

      function* requestStorageAuthorization() {
        const wasGranted = yield permissionSource.authorizeStorage();
        yield put(
          (wasGranted ? creators.storageGranted : creators.storageDenied)()
        );
      }

      function* watchStorageRequests() {
        yield takeEvery(types.REQUEST_STORAGE, requestStorageAuthorization);
      }

      function* requestDeviceAuthorization(action: any) {
        const { deviceName } = action.payload;
        const wasGranted = yield permissionSource.authorizeDevice(deviceName);
        yield put(
          (wasGranted ? creators.deviceGranted : creators.deviceDenied)(deviceName)
        );
      }

      function* watchDeviceRequests() {
        yield takeEvery(types.REQUEST_DEVICE, requestDeviceAuthorization);
      }

      yield all([
        fork(watchDeviceRequests),
        fork(watchStorageRequests),
      ]);
    }
}
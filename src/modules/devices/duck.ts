import { Duck } from 'lib/duck';
import * as TYPES from 'src/types';
import { DeviceList, default as models } from './models';
import * as redux from 'redux';
import { injectable } from 'inversify';
import { DeviceSource } from './sources/DeviceSource';
import { container } from 'src/ioc';
import getDecorators from 'inversify-inject-decorators';
import deviceSaga from './sagas';

const { lazyInject } = getDecorators(container);

interface DeviceInfo extends models.DeviceInfo {
}

type DeviceState = DeviceList | null

function cloneDeviceList(deviceList: DeviceList): DeviceList {
  const newState: DeviceState = {};
  Object.keys(deviceList).forEach(key => {
    newState[key] = { ...(deviceList[key]) };
  });
  return newState;
}

const initialState: DeviceState = {};

@injectable()
export class DeviceDuck extends Duck {
    @lazyInject(TYPES.DeviceSource.identifier)
    // @ts-ignore
    private _deviceSource: DeviceSource;

    public get deviceSource() {
      return this._deviceSource;
    }

    get actionTypePrefix() {
      return 'devices';
    }

    get quickTypes() {
      return {
        ...super.quickTypes,
        INIT_DEVICE_LIST:   1,
        ATTACH_ALL_DEVICES: 1,
        DETACH_ALL_DEVICES: 1,
        ATTACH_DEVICE:      1,
        DETACH_DEVICE:      1,
      };
    }

    get creators() {
      const actionTypes = this.types;
      return {
        initDeviceList() {
          return { type: actionTypes.INIT_DEVICE_LIST };
        },
        attachAll(deviceList: DeviceList) {
          return {
            type:    actionTypes.ATTACH_ALL_DEVICES,
            payload: deviceList,
          };
        },
        detachAll() {
          return {
            type: actionTypes.DETACH_ALL_DEVICES,
          };
        },
        attach(deviceInfo: DeviceInfo) {
          return {
            type:    actionTypes.ATTACH_DEVICE,
            payload: deviceInfo,
          };
        },
        detach(deviceName: string) {
          return {
            type:    actionTypes.DETACH_DEVICE,
            payload: { deviceName },
          };
        },
      };
    }

    private get deviceReducer(): redux.Reducer {
      return (state: DeviceState = initialState, action: any) => {
        const actionTypes = this.types;
        switch (action.type) {
        case actionTypes.ATTACH_ALL_DEVICES: {
          const oldState = cloneDeviceList(state || {});
          const newState = cloneDeviceList(action.payload);
          return { ...oldState, ...newState };
        }
        case actionTypes.DETACH_ALL_DEVICES: {
          return {};
        }
        case actionTypes.ATTACH_DEVICE: {
          return {
            ...cloneDeviceList(state || {}),
            [action.payload.deviceName]: { ...action.payload },
          };
        }
        case actionTypes.DETACH_DEVICE: {
          const newState = cloneDeviceList(state || {});
          delete newState[action.payload.deviceName];
          return newState;
        }
        default:
          return state;
        }
      };
    }

    get reducer() {
      return this.deviceReducer;
    }

    * saga() {
      yield* super.saga();
      yield deviceSaga(this);
    }
}

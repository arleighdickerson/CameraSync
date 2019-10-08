import { getToken } from 'inversify-token';
import { interfaces, postConstruct } from 'inversify';
import * as TYPES from 'types';
import { DeviceSourceWrapper } from './DeviceSourceWrapper';
import { isDeviceEvent } from '../models';
import * as deviceModule from '../actions';
import { DeviceSource } from './DeviceSource';
import { Constructor } from 'util/typeHelpers';

export abstract class DeviceEventHandlingDecorator extends DeviceSourceWrapper {
    private _handlers?: { [key: string]: (evt: any) => any };

    abstract get container(): interfaces.Container;

    protected constructor() {
      super();
    }

    get handlers() {
      if (!this._handlers) {
        this._handlers = Object.freeze({
          [this.EVENT_DEVICE_ATTACHED]: (evt: any) => {
            if (isDeviceEvent(evt)) {
              this.store.dispatch(deviceModule.attach(evt.payload));
            }
          },
          [this.EVENT_DEVICE_DETACHED]: (evt: any) => {
            if (isDeviceEvent(evt)) {
              this.store.dispatch(deviceModule.detach(evt.payload.deviceName));
            }
          },
        });
      }
      return this._handlers;
    }

    get store() {
      return getToken(this.container, TYPES.Store);
    }

    get eventEmitter() {
      return getToken(this.container, TYPES.EventSource);
    }

    @postConstruct()
    protected init() {
      Object.entries(this.handlers).forEach(([name, handler]) => {
        this.eventEmitter.addListener(name, handler);
      });
    }

    static mixin(container: interfaces.Container, ctor: Constructor<DeviceSource>): Constructor<DeviceEventHandlingDecorator> {
      return class extends this {
            private readonly _delegate: DeviceSource;

            get container() {
              return container;
            }

            constructor(...args: any[]) {
              super();
              this._delegate = new ctor(...args);
            }

            get delegate() {
              return this._delegate;
            }
      };
    }
}

import { getToken } from 'inversify-token';
import { postConstruct } from 'inversify';
import * as TYPES from 'types';
import { container } from 'ioc';
import { DeviceSourceWrapper } from './DeviceSourceWrapper';
import { isDeviceEvent } from '../models';
import * as deviceModule from '../actions';
import { DeviceSource } from './DeviceSource';
import { Constructor } from 'util/typeHelpers';

export abstract class EventHandlingDecorator extends DeviceSourceWrapper {
    private _handlers?: { [key: string]: (evt: any) => any };

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
      return getToken(container, TYPES.Store);
    }

    get eventEmitter() {
      return getToken(container, TYPES.EventSource);
    }

    @postConstruct()
    protected init() {
      Object.entries(this.handlers).forEach(([name, handler]) => {
        this.eventEmitter.addListener(name, handler);
      });
    }

    static mixin(ctor: Constructor<DeviceSource>): Constructor<EventHandlingDecorator> {
      return class extends this {
            private readonly _delegate: DeviceSource;

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

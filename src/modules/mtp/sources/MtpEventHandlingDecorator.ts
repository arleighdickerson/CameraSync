import { getToken } from 'inversify-token';
import { interfaces, postConstruct } from 'inversify';
import * as TYPES from 'types';
import { MtpSourceWrapper } from './MtpSourceWrapper';
import { isMtpEvent } from '../models';
import { MtpSource } from './MtpSource';
import { Constructor } from 'util/typeHelpers';

export abstract class MtpEventHandlingDecorator extends MtpSourceWrapper {
    private _handlers?: { [key: string]: (evt: any) => any };

    abstract get container(): interfaces.Container;

    protected constructor() {
      super();
    }

    get handlers() {
      if (!this._handlers) {
        this._handlers = Object.freeze({
          [this.EVENT_MTP_SCAN]: (evt: any) => {
            if (isMtpEvent(evt)) {
              // this.store.dispatch(deviceModule.attach(evt.payload));
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

    static mixin(container: interfaces.Container, ctor: Constructor<MtpSource>): Constructor<MtpEventHandlingDecorator> {
      return class extends this {
            private readonly _delegate: MtpSource;

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

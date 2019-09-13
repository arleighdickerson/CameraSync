import { DeviceSource } from './DeviceSource';
import { injectable } from 'inversify';

@injectable()
export abstract class DeviceSourceWrapper implements DeviceSource {
    abstract get delegate(): DeviceSource;

    fetchAll() {
      return this.delegate.fetchAll();
    }

    get EVENT_DEVICE_ATTACHED() {
      return this.delegate.EVENT_DEVICE_ATTACHED;
    }

    get EVENT_DEVICE_DETACHED() {
      return this.delegate.EVENT_DEVICE_DETACHED;
    }

    get E_DEVICE_MISSING() {
      return this.delegate.E_DEVICE_MISSING;
    }

    get E_NO_DEVICES_CONNECTED() {
      return this.delegate.E_NO_DEVICES_CONNECTED;
    }
}

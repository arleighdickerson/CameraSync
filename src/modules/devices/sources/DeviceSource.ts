import { DeviceList } from '../models';

export interface DeviceSource {
    readonly EVENT_DEVICE_ATTACHED: string;
    readonly EVENT_DEVICE_DETACHED: string;
    readonly E_DEVICE_MISSING: string;
    readonly E_NO_DEVICES_CONNECTED: string;
    fetchAll: () => Promise<DeviceList>;
}

export abstract class DeviceSourceWrapper implements DeviceSource {
    protected abstract get delegate(): DeviceSource;

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

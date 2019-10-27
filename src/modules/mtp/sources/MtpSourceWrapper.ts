import { MtpSource } from './MtpSource';
import { injectable } from 'inversify';

@injectable()
export abstract class MtpSourceWrapper implements MtpSource {
    protected abstract get delegate(): MtpSource;

    get EVENT_DEVICE_ATTACHED() {
      return this.delegate.EVENT_DEVICE_ATTACHED;
    }

    get EVENT_DEVICE_DETACHED() {
      return this.delegate.EVENT_DEVICE_DETACHED;
    }

    getDeviceInfo() {
      return this.delegate.getDeviceInfo();
    }

    requestDevicePermission() {
      return this.delegate.requestDevicePermission();
    }

    scanObjectHandles() {
      return this.delegate.scanObjectHandles();
    }

    requestStoragePermission() {
      return this.delegate.requestStoragePermission();
    }
}

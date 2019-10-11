import { MtpSource } from './MtpSource';
import { injectable } from 'inversify';

@injectable()
export class MockMtpSource implements MtpSource {
    readonly EVENT_DEVICE_ATTACHED = 'EVENT_DEVICE_ATTACHED'
    readonly EVENT_DEVICE_DETACHED = 'EVENT_DEVICE_DETACHED'

    async getDeviceInfo() {
      return null;
    }

    async getObjectHandles() {
      return [];
    }

    async requestDevicePermission() {
      return false;
    }
}

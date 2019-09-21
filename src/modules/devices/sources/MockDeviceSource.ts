import { DeviceSource } from './DeviceSource';
import { DeviceList } from '../models';
import { injectable } from 'inversify';

@injectable()
export class MockDeviceSource implements DeviceSource {
    EVENT_DEVICE_ATTACHED: string = 'EVENT_DEVICE_ATTACHED';
    EVENT_DEVICE_DETACHED: string = 'EVENT_DEVICE_DETACHED';
    E_DEVICE_MISSING: string = 'E_DEVICE_MISSING';
    E_NO_DEVICES_CONNECTED: string = 'E_NO_DEVICES_CONNECTED';

    fetchAll() {
      const deviceList: DeviceList = {};
      return Promise.resolve<DeviceList>(deviceList);
    }
}

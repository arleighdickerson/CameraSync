import { DeviceSource } from './DeviceSource';
import { DeviceList } from '../models';

export class MockDeviceSource implements DeviceSource {
    EVENT_DEVICE_ATTACHED: string = 'EVENT_DEVICE_ATTACHED';
    EVENT_DEVICE_DETACHED: string = '';
    E_DEVICE_MISSING: string = '';
    E_NO_DEVICES_CONNECTED: string = '';

    fetchAll() {
      const deviceList: DeviceList = {};
      return Promise.resolve<DeviceList>(deviceList);
    }
}

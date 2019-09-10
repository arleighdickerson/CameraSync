import { MockDeviceSource } from './MockDeviceSource';
import { DeviceSource } from './DeviceSource';

export const mockDeviceSourceFactory = (): DeviceSource => new MockDeviceSource();


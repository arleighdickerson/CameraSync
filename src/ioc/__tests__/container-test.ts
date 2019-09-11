import container from 'src/ioc';
import { TYPES } from 'src/modules/devices';
import { DeviceSource } from '../../modules/devices/sources/DeviceSource';
import { getToken } from 'inversify-token';
import { MockDeviceSource } from '../../modules/devices/sources/MockDeviceSource';

it('should be able to resolve a device instance', () => {
  const source: DeviceSource = getToken(container, TYPES.DeviceSource);

  expect(source).toBeInstanceOf(MockDeviceSource);
});

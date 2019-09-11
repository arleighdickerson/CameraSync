import { getToken } from 'inversify-token';
import container from 'src/ioc';
import * as TYPES from 'src/modules/devices/sources/types';
import { DeviceSource } from 'src/modules/devices/sources/DeviceSource';
import { MockDeviceSource } from 'src/modules/devices/sources/MockDeviceSource';

it('should be able to resolve a device instance', () => {
  const source: DeviceSource = getToken(container, TYPES.DeviceSource);

  expect(source).toBeInstanceOf(MockDeviceSource);
});

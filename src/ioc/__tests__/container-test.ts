import container from 'src/ioc';
import { DeviceDuck } from 'src/modules/devices/duck';
import { getToken } from 'inversify-token';
import * as TYPES from 'src/types';
import { DeviceSource } from 'src/modules/devices/sources/DeviceSource';
import { MockDeviceSource } from 'src/modules/devices/sources/MockDeviceSource';

it('should be able to resolve a device instance', () => {
  const duck = new DeviceDuck();
  expect(duck.deviceSource).toBeTruthy();
});

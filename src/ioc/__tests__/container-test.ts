import { DeviceDuck } from 'src/modules/devices';

it('should be able to handle property injection', () => {
  const duck = new DeviceDuck();
  expect(duck.deviceSource).toBeTruthy();
});

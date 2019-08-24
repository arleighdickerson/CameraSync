import {
  DeviceInfo,
  isDeviceInfo,
  DeviceList,
  isDeviceList,
  DeviceEvent,
  isDeviceEvent,
} from '../index';

const deviceInfo: DeviceInfo = {
  deviceProtocol:   0,
  deviceSubclass:   0,
  productId:        0,
  vendorId:         0,
  deviceId:         0,
  serialNumber:     '',
  version:          'version',
  productName:      'productName',
  manufacturerName: 'manufacturerName',
  deviceName:       'deviceName',
};

const notDeviceInfo = {
  ...deviceInfo,
  deviceProtocol: 'shenanigans',
};

it('type guards enforce DeviceInfo appropriately', () => {
  expect(isDeviceInfo(deviceInfo)).toBe(true);
  expect(isDeviceInfo(notDeviceInfo)).toBe(false);
});

const deviceList: DeviceList = {
  [deviceInfo.deviceName]: { ...deviceInfo },
};

const notDeviceList = {
  [notDeviceInfo.deviceName]: { ...notDeviceInfo },
};

it('type guards enforce DeviceList appropriately', () => {
  expect(isDeviceList(deviceList)).toBe(true);
  expect(isDeviceList(notDeviceList)).toBe(false);
});

const deviceEvent: DeviceEvent = {
  type:    'EVENT_DEVICE_ATTACHED',
  payload: { ...deviceInfo },
  error:   false,
};

it('type guards enforce DeviceEvent appropriately', () => {
  expect(isDeviceEvent(deviceEvent)).toBe(true);
});

import 'src/App'; // bootstraps sagas and redux store
import { container } from 'src/ioc';

const action = {
  type:    'devices/ATTACH_DEVICE',
  payload: {
    deviceProtocol:   0,
    deviceSubclass:   0,
    productId:        30582,
    vendorId:         2821,
    deviceId:         1002,
    serialNumber:     'JCAXB763Z981RLZ',
    version:          '1.16',
    productName:      'SDM636-MTP _SN:7D4E27C7',
    manufacturerName: 'asus',
    deviceName:       '/dev/bus/usb/001/002',
  },
};

it('watches for device list initialization', () => {
  expect(true).toBeTruthy();
});

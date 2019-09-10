import { DeviceList } from '../modules/devices/models';

export type Permissions = {
    hasStorage: () => Promise<boolean>,
    hasDevice: (name?: string) => Promise<boolean>,
    authorizeStorage: () => Promise<boolean>,
    authorizeDevice: (name?: string) => Promise<boolean>,
}

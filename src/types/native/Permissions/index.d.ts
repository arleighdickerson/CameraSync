export type PermissionsModule = {
    hasStorage: () => Promise<boolean>,
    hasDevice: (name?: string) => Promise<boolean>,
    authorizeStorage: () => Promise<boolean>,
    authorizeDevice: (name?: string) => Promise<boolean>,
}

declare module 'react-native';

export default interface NativeModules {
    Permissions: PermissionsModule;
}

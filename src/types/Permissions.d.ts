declare module 'react-native';

export interface NativeModules {
    Permissions: {
        hasStorage: () => Promise<boolean>,
        hasDevice: (name?: string) => Promise<boolean>,
        authorizeStorage: () => Promise<boolean>,
        authorizeDevice: (name?: string) => Promise<boolean>,
    }
}

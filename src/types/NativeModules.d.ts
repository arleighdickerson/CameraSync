import { MtpSource } from 'modules/mtp/sources/MtpSource';

declare module 'react-native';

export interface NativeModules {
    MediaTransfer: MtpSource
}

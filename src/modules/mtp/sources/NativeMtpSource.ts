import { MtpSourceWrapper } from './MtpSourceWrapper';
import { MtpSource } from './MtpSource';
import { NativeModules } from 'react-native';
// import assert from 'assert';
import { injectable } from 'inversify';

export const resolveNativeModule = (() => {
  let nativeModule: MtpSource | null = null;
  return (): MtpSource => {
    if (nativeModule === null) {
      // assert(NativeModules, 'react-native.NativeModules apparently not present');
      const { MediaTransfer } = NativeModules;
      // assert(NativeModules, 'react-native.NativeModules.Mtp apparently not present');
      nativeModule = MediaTransfer;
    }
    return <MtpSource>nativeModule;
  };
})();

@injectable()
export class NativeMtpSource extends MtpSourceWrapper {
  get delegate() {
    return resolveNativeModule();
  }
}

import { PermissionSourceWrapper } from './PermissionSourceWrapper';
import { PermissionSource } from './PermissionSource';
// import assert from 'assert';
import { injectable } from 'inversify';

export const resolveNativeModule = (() => {
  let nativeModule: PermissionSource | null = null;
  return (): PermissionSource => {
    if (nativeModule === null) {
      const { NativeModules } = require('react-native');
      // assert(NativeModules, 'react-native.NativeModules apparently not present');
      const { Permissions } = NativeModules;
      // assert(NativeModules, 'react-native.NativeModules.Permissions apparently not present');
      nativeModule = Permissions;
    }
    return <PermissionSource>nativeModule;
  };
})();

@injectable()
export class NativePermissionSource extends PermissionSourceWrapper {
  get delegate() {
    return resolveNativeModule();
  }
}

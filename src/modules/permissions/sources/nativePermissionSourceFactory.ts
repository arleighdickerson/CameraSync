import { PermissionSource, PermissionSourceWrapper } from './PermissionSource';


const createSource = () => {
  const { Permissions } = require('react-native').NativeModules;
  return new PermissionSourceWrapper(Permissions);
};

function createFactory(): () => PermissionSource {
  let instance: PermissionSource | null = null;
  return () => {
    if (instance === null) {
      instance = createSource();
    }
    return instance;
  };
}

export const nativePermissionSourceFactory = createFactory();

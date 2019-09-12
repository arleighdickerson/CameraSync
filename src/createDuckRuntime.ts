import _ from 'lodash';
import {
  ComposableDuck,
  BaseDuck,
  DuckRuntime,
  DuckOptions, DuckRuntimeOptions,
} from 'src/lib/duck';
import { DeviceDuck } from 'src/modules/devices/duck';
import { PermissionDuck } from 'src/modules/permissions/duck';
import {
  Reducer,
  StoreEnhancer,
  Middleware,
} from 'redux';
import { createGhostObject } from 'src/util/ghostObject';

export interface StoreConfiguration {
    reducers: { [key: string]: Reducer },
    middlewares?: Middleware[],
    enhancers?: StoreEnhancer[]
}

class DuckForReducer extends BaseDuck {
    private readonly _reducer: Reducer;

    constructor(reducer: Reducer, options?: DuckOptions) {
      options ? super(options) : super();
      this._reducer = reducer;
    }

    get reducer() {
      return this._reducer;
    }
}

const createInstance = ({ reducers, middlewares = [], enhancers = [] }: StoreConfiguration): DuckRuntime => {
  class RootDuck extends ComposableDuck {
    get rawDucks() {
      const deviceKey = 'devices';
      const permissionKey = 'permissions';

      const deviceDuck = new DeviceDuck(this.getSubDuckOptions(deviceKey));
      const permissionDuck = new PermissionDuck(this.getSubDuckOptions(permissionKey), deviceDuck);

      const reducerDucks = _.mapValues(
        reducers,
        (reducer, key) => new DuckForReducer(reducer, this.getSubDuckOptions(key))
      );

      return {
        ...reducerDucks,
        [deviceKey]:     deviceDuck,
        [permissionKey]: permissionDuck,
      };
    }
  }

  const rootDuck = new RootDuck();

  const options: DuckRuntimeOptions = {
    middlewares,
    enhancers,
  };

  return new DuckRuntime(rootDuck, options);
};

const createFactory = (storeConfiguration: StoreConfiguration) => {
  let instance: DuckRuntime | null = null;
  return (): DuckRuntime => {
    if (instance === null) {
      instance = createInstance(storeConfiguration);
    }
    return instance;
  };
};

export default (storeConfiguration: StoreConfiguration) => {
  return createGhostObject(createFactory(storeConfiguration));
};

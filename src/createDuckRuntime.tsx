import {
  ComposableDuck,
  Duck,
  BaseDuck,
  DuckRuntime,
  DuckOptions, DuckRuntimeOptions,
} from 'saga-duck';
import { DeviceDuck } from './modules/devices/duck';
import { PermissionDuck } from './modules/permissions/duck';
import {
  Reducer,
  StoreEnhancer,
  Middleware,
  Store,
} from 'redux';
import { createGhostObject } from 'src/util/ghostObject';

export interface StoreConfiguration {
    reducers: { [key: string]: Reducer },
    middlewares?: Middleware[],
    enhancers?: StoreEnhancer[]
}

const createInstance = ({ reducers, middlewares = [], enhancers = [] }: StoreConfiguration): DuckRuntime => {
  const createDuckForReducer = (reducer: Reducer) => {
    return class extends BaseDuck {
      constructor(options: DuckOptions | null = null) {
        const args = options === null ? [] : [options];
        super(...args);
      }

      get reducer() {
        return reducer;
      }
    };
  };

  class RootDuck extends ComposableDuck {
    get quickDucks() {
      const ducks = {};

      Object.entries(reducers).forEach(([key, reducer]) => {
        // @ts-ignore
        ducks[key] = createDuckForReducer(reducer);
      });

      return {
        ...ducks,
        devices:     DeviceDuck,
        permissions: PermissionDuck,
      };
    }
  }

  const rootDuck = new RootDuck();

  const options: DuckRuntimeOptions = { middlewares, enhancers };
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

export default (storeConfiguration: StoreConfiguration) => createGhostObject(createFactory(storeConfiguration));

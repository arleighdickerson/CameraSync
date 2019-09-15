import { DuckRuntime, DuckRuntimeOptions } from 'lib/duck';
import { Reducer, StoreEnhancer, Middleware } from 'redux';
import { RootDuck } from './modules/RootDuck';

export interface StoreConfiguration {
    reducers: { [key: string]: Reducer },
    middlewares?: Middleware[],
    enhancers?: StoreEnhancer[]
}

const createInstance = ({ reducers, middlewares = [], enhancers = [] }: StoreConfiguration): DuckRuntime => {
  const rootDuck = new RootDuck(reducers);

  const options: DuckRuntimeOptions = {
    middlewares,
    enhancers,
  };

  return new DuckRuntime(rootDuck, options);
};

export default (storeConfiguration: StoreConfiguration) => {
  return createInstance(storeConfiguration);
};

import * as interfaces from './interfaces';

export { interfaces };

export interface DuckCmpProps<T = any> {
    duck: T;
    store: any;
    dispatch: (action: any) => any;
}

export interface DuckOptions {
    namespace: string;

    selector(globalState: any): any;

    route: string;
}

export const defaultDuckOptions: DuckOptions = Object.freeze({
  namespace: 'global',
  selector(a) {
    return a;
  },
  route: '',
});

export interface DuckCmpProps<T = any> {
    duck: T;
    store: any;
    dispatch: (action: any) => any;
}

export interface DuckRuntimeOptions {
    middlewares?: any[]
    enhancers?: any[]
}

export { default as BaseDuck } from './BaseDuck';
export { default as Duck } from './Duck';
export {
  default as ComposableDuck,
  /**
     * `ComposableDuck`的别名 alias of `ComposableDuck`
     *
     * 历史兼容 legacy compatibility
     */
  default as DuckMap,
} from './ComposableDuck';
export { default as DuckRuntime, INIT, END } from './DuckRuntime';
export { purify, shouldComponentUpdate, memo } from './purify';
export {
  asResult,
  reduceFromPayload,
  createToPayload,
  memorize,
} from './helper';

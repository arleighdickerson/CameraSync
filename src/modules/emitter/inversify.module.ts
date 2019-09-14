import * as TYPES from 'src/types';
import { TokenContainerModule } from 'inversify-token';
import { nativeEventSourceFactory } from './sources/nativeEventSourceFactory';

// @see https://github.com/mscharley/inversify-token#usage

export default new TokenContainerModule((bindToken) => {
  bindToken(TYPES.EventSource)
    .toDynamicValue(nativeEventSourceFactory)
    .inSingletonScope();
});

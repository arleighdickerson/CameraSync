import { isTest } from 'src/util/env';
import * as TYPES from 'src/types';
import { TokenContainerModule } from 'inversify-token';
import { nativeEventSourceFactory } from './sources/nativeEventSourceFactory';
import { mockEventSourceFactory } from './sources/mockEventSourceFactory';

// @see https://github.com/mscharley/inversify-token#usage

export default new TokenContainerModule((bindToken) => {
  bindToken(TYPES.EventSource)
    .toDynamicValue(isTest ? mockEventSourceFactory : nativeEventSourceFactory)
    .inSingletonScope();
});

import { compose as _compose } from 'redux';

import { DevToolOptions } from './';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const createWithoutDevTools = (opts: any) => _compose;

const createWithDevTools = __DEV__
  ? require('remote-redux-devtools').composeWithDevTools
  : createWithoutDevTools;

const createComposer = (devToolOptions: DevToolOptions) => {
  const createCompose = __DEV__ ? createWithDevTools : createWithoutDevTools;
  return createCompose(devToolOptions);
};

export default createComposer;

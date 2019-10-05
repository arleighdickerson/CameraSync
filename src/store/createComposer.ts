import { compose } from 'redux';

export type DevToolOptions = {
    name?: string,
    filters?: {
        blacklist?: any,
        whitelist?: any
    },
    port?: number,
    hostname?: string,
    secure?: boolean,
    stateSanitizer?: any,
    actionSanitizer?: any,
    realtime?: boolean,
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const createWithoutDevTools = (opts: any) => compose;

const createWithDevTools = __DEV__
  ? require('remote-redux-devtools').composeWithDevTools
  : createWithoutDevTools;

export default (devTools: boolean, devToolOptions: DevToolOptions) => {
  const createComposer = devTools ? createWithDevTools : createWithoutDevTools;
  return createComposer(devToolOptions);
};

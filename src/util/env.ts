import has = Reflect.has;

const getOrElse = (target: any, key: string, defaultValue: any) => {
  return has(target, key) ? target[key] : defaultValue;
};

const resolveGlobalBoolean = (key: string) => !!getOrElse(global, key, false);

export const isTest = resolveGlobalBoolean('__TEST__');

export const isJest = process.env.JEST_WORKER_ID !== undefined;

export const isDev = resolveGlobalBoolean('__DEV__');

/*
// @todo put a named singleton bean of this instance in the container
interface EnvConfig {
    readonly isTest: Boolean;
    readonly isJest: Boolean;
    readonly isDev: Boolean;
}

// @todo call this stuff from the container and not static module
class DefaultEnvConfig implements EnvConfig {
  get isTest() {
    return resolveGlobalBoolean('__TEST__');
  }

  get isJest() {
    return process.env.JEST_WORKER_ID !== undefined;
  }

  get isDev() {
    return resolveGlobalBoolean('__DEV__');
  }
}
*/

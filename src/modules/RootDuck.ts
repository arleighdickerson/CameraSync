import {
  BaseDuck,
  ComposableDuck,
  DuckOptions,
} from 'lib/duck';
import { DeviceDuck } from './devices';
import { PermissionDuck } from './permissions';
import _ from 'lodash';
import { Reducer } from 'redux';
import { injectable } from 'inversify';

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

const deviceKey = 'devices';
const permissionKey = 'permissions';

@injectable()
export class RootDuck extends ComposableDuck {
    private _deviceDuck?: DeviceDuck;
    private _permissionDuck?: PermissionDuck;

    constructor(private readonly reducerMap: { [key: string]: Reducer }) {
      super();
    }

    get deviceDuck(): DeviceDuck {
      if (!this._deviceDuck) {
        this._deviceDuck = new DeviceDuck(this.getSubDuckOptions(deviceKey));
      }
      return this._deviceDuck;
    }

    get permissionDuck(): PermissionDuck {
      if (!this._permissionDuck) {
        this._permissionDuck = new PermissionDuck(this.getSubDuckOptions(permissionKey), this.deviceDuck);
      }
      return this._permissionDuck;
    }

    get rawDucks() {
      return {
        ...this.reducerDucks,
        [deviceKey]:     this.deviceDuck,
        [permissionKey]: this.permissionDuck,
      };
    }

    protected get reducerDucks() {
      return _.mapValues(
        this.reducerMap,
        (reducer, key) => new DuckForReducer(reducer, this.getSubDuckOptions(key)
        )
      );
    }
}

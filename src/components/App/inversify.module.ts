import { connect } from 'react-redux';
import {
  createNavigationReducer,
  createReactNavigationReduxMiddleware,
  createReduxContainer,
} from 'react-navigation-redux-helpers';
import { TokenContainerModule } from 'inversify-token';

import * as TYPES from 'types';
import createNavigator from 'routes';
import createReduxStore from 'store/createStore';

const mapStateToProps = (state: any) => ({ state: state.nav });

export class AppDependencies extends TokenContainerModule {
    private _AppNavigator?: any;
    private _App?: any;
    private _AppWithNavigationState?: any;
    private _store?: any;

    constructor() {
      super(bindToken => {
        bindToken(TYPES.Store).toDynamicValue(() => this.store);
      });
    }

    get AppNavigator() {
      if (!this._AppNavigator) {
        this._AppNavigator = createNavigator();
      }
      return this._AppNavigator;
    }

    get App() {
      if (!this._App) {
        this._App = createReduxContainer(this.AppNavigator);
      }
      return this._App;
    }

    get AppWithNavigationState() {
      if (!this._AppWithNavigationState) {
        this._AppWithNavigationState = connect(mapStateToProps)(this.App);
      }
      return this._AppWithNavigationState;
    }

    get store() {
      if (!this._store) {
        this._store = createReduxStore({
          reducers: {
            nav: createNavigationReducer(this.AppNavigator),
          },
          middleware: [
            createReactNavigationReduxMiddleware(mapStateToProps),
          ],
        });
      }
      return this._store;
    }
}

export default new AppDependencies();

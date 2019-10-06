import { connect } from 'react-redux';
import {
  createNavigationReducer,
  createReactNavigationReduxMiddleware,
  createReduxContainer,
} from 'react-navigation-redux-helpers';
import { TokenContainerModule } from 'inversify-token';
import { interfaces } from 'inversify';

import * as TYPES from 'types';
import createNavigator from 'routes';
import createReduxStore, { CreatedStore } from 'store/createStore';
import createContainer from 'ioc/createContainer';
import { wrap as createApp } from './Wrapper';

type DependencyOptions = {
    navReducerKey: string
}

const defaults = {
  navReducerKey: 'nav',
};

export class AppDependencies extends TokenContainerModule {
    private _AppNavigator?: any;
    private _AppWithNavigationState?: any;
    private _App?: any;
    private _container?: interfaces.Container;
    private _createdStoreResult?: CreatedStore;

    private readonly navReducerKey: string;
    private readonly mapStateToProps: (state: any) => any;

    constructor(protected readonly options: DependencyOptions = defaults) {
      super(bindToken => {
        bindToken(TYPES.Store).toDynamicValue(() => this.store);
      });

      const { navReducerKey } = options;
      this.navReducerKey = navReducerKey;
      this.mapStateToProps = (state: any) => ({ state: state[navReducerKey] });
    }

    protected get AppNavigator() {
      if (!this._AppNavigator) {
        this._AppNavigator = createNavigator();
      }
      return this._AppNavigator;
    }

    protected get AppWithNavigationState() {
      if (!this._AppWithNavigationState) {
        const AppContainer = createReduxContainer(this.AppNavigator);
        this._AppWithNavigationState = connect(this.mapStateToProps)(AppContainer);
      }
      return this._AppWithNavigationState;
    }

    get App() {
      if (!this._App) {
        this._App = createApp(this.AppWithNavigationState, this);
      }
      return this._App;
    }

    get container() {
      if (!this._container) {
        this._container = createContainer(this);
      }
      return this._container;
    }

    get store() {
      return this.createdStoreResult.store;
    }

    get persistor() {
      return this.createdStoreResult.persistor;
    }

    get ready() {
      return this.createdStoreResult.ready;
    }

    private get createdStoreResult() {
      if (!this._createdStoreResult) {
        const context = {};
        Object.defineProperty(context, 'container', {
          get: () => this.container,
        });
        const sagaMiddlewareOptions = { context };

        this._createdStoreResult = createReduxStore({
          sagaMiddlewareOptions,
          reducers: {
            [this.navReducerKey]: createNavigationReducer(this.AppNavigator),
          },
          middleware: [
            createReactNavigationReduxMiddleware(this.mapStateToProps),
          ],
        });
      }
      return this._createdStoreResult;
    }
}

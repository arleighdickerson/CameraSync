import { connect } from 'react-redux';
import _createSagaMiddleware from 'redux-saga';
import {
  createNavigationReducer,
  createReactNavigationReduxMiddleware,
  createReduxContainer,
} from 'react-navigation-redux-helpers';
import { TokenContainerModule } from 'inversify-token';
import { interfaces } from 'inversify';
import {
  createStore,
  Reducer,
  Middleware,
  StoreEnhancer,
  applyMiddleware,
} from 'redux';
import * as TYPES from 'types';
import createNavigator from 'routes';
import { CreatedStore, StoreOptions } from 'store/createStore';
import createContainer from 'ioc/createContainer';
import { wrap as createApp } from './Wrapper';
import createReducer from '../../store/createReducer';
import { compose } from 'store/createComposer';
import Deferred from '../../util/Deferred';
import * as reduxPersist from 'redux-persist';
import _ from 'lodash';
import rootSaga from '../../store/rootSaga';


type DependencyOptions = {
    navReducerKey: string
}

const defaults = {
  navReducerKey: 'nav',
};

type ReducerMap = { [key: string]: Reducer }

export class AppDependencies extends TokenContainerModule {
    private readonly navReducerKey: string;
    private readonly mapStateToProps: (state: any) => any;

    private _AppNavigator?: any;
    private _AppContainer?: any;
    private _AppWithNavigationState?: any;
    private _App?: any;

    private _container?: interfaces.Container;

    readonly enhancers: StoreEnhancer[] = [];
    private _rootEnhancer?: StoreEnhancer;
    private _reducers?: ReducerMap;
    private _rootReducer?: Reducer;
    private _middleware?: Middleware[];
    private _sagaMiddleware?: any;

    private _createdStoreResult?: CreatedStore;


    constructor(protected readonly options: DependencyOptions = defaults) {
      super(bindToken => {
        bindToken(TYPES.Store).toDynamicValue(() => this.store).inSingletonScope();
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

    protected get AppContainer() {
      if (!this._AppContainer) {
        this._AppContainer = createReduxContainer(this.AppNavigator);
      }
      return this._AppContainer;
    }

    get AppWithNavigationState() {
      if (!this._AppWithNavigationState) {
        this._AppWithNavigationState = connect(this.mapStateToProps)(this.AppContainer);
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

    get rootReducer() {
      if (!this._rootReducer) {
        this._rootReducer = createReducer(this.reducers, this.storeOptions);
      }
      return this._rootReducer;
    }

    get reducers(): ReducerMap {
      if (!this._reducers) {
        this._reducers = {
          [this.navReducerKey]: createNavigationReducer(this.AppNavigator),
        };
      }
      return this._reducers;
    }

    get sagaMiddleware() {
      if (!this._sagaMiddleware) {
        this._sagaMiddleware = this.createSagaMiddleware();
      }
      return this._sagaMiddleware;
    }

    get middleware() {
      if (!this._middleware) {
        this._middleware = [
          this.sagaMiddleware,
          createReactNavigationReduxMiddleware(this.mapStateToProps),

        ];
      }
      return this._middleware;
    }

    get rootEnhancer() {
      if (!this._rootEnhancer) {
        this._rootEnhancer = compose(applyMiddleware(...this.middleware), ...this.enhancers);
      }
      return this._rootEnhancer;
    }

    get storeOptions(): StoreOptions {
      return {
        devTools:     true,
        persistStore: true,
      };
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
        const store = createStore(this.rootReducer, this.rootEnhancer);

        let ready: Promise<void> = Promise.resolve();
        let persistor = null;

        if (this.storeOptions.persistStore) {

          const deferred: Deferred<void> = new Deferred();
          ready = deferred.promise;

          const persistorOptions = null; // enhancer?

          const callback = (error?: any) => {
            if (error) {
              deferred.reject(error);
            } else {
              deferred.resolve();
            }
          };

          persistor = reduxPersist.persistStore(store, persistorOptions, callback);

          const unsubscribe = store.subscribe(() => {
            if (_.get(store.getState(), '_persist.rehydrated', false)) {
              unsubscribe();
              // start sags
              this.sagaMiddleware.run(rootSaga);
            }
          });
        } else {
          // start sags
          this.sagaMiddleware.run(rootSaga);
        }

        this._createdStoreResult = { store, persistor, ready };
      }
      return this._createdStoreResult;
    }

    private createSagaMiddleware() {
      const context = {};
      Object.defineProperty(context, 'container', {
        get: () => this.container,
      });
      const sagaMiddlewareOptions = { context };
      return _createSagaMiddleware(sagaMiddlewareOptions);
    }

}

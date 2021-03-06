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
  applyMiddleware, Store,
} from 'redux';
import * as TYPES from 'types';
import { createNavigator } from 'routes';
import { createContainer } from 'ioc';
import Deferred from 'util/Deferred';
import * as reduxPersist from 'redux-persist';
import _ from 'lodash';
import { rootSaga, createReducer, createComposer, DevToolOptions } from 'store';

type CreatedStore = {
    store: Store,
    persistor: reduxPersist.Persistor | null,
    ready: Promise<void>
}

export type DependencyOptions = {
    devToolOptions: DevToolOptions,
    persistConfig?: reduxPersist.PersistConfig<any>,
    navReducerKey: string
}

const defaults: DependencyOptions = {
  navReducerKey:  'nav',
  devToolOptions: {
    port:     8000,
    realtime: process.env.NODE_ENV !== 'test',
  },
  /*
  persistConfig: {
    key:       'root',
    storage:   AsyncStorage,
    whitelist: [], // nopping for now
  },

     */
};

type ReducerMap = { [key: string]: Reducer }

export default class AppDependencies {
    private readonly navReducerKey: string;
    private readonly mapStateToProps: (state: any) => any;

    private _AppNavigator?: any;
    private _AppContainer?: any;
    private _AppWithNavigationState?: any;

    private _container?: interfaces.Container;

    readonly enhancers: StoreEnhancer[] = [];
    private _rootEnhancer?: StoreEnhancer;
    private _reducers?: ReducerMap;
    private _rootReducer?: Reducer;
    private _middleware?: Middleware[];
    private _sagaMiddleware?: any;

    private _createdStoreResult?: CreatedStore;

    protected readonly containerModule = new TokenContainerModule(
      bindToken => {
        bindToken(TYPES.Store).toDynamicValue(() => this.store);
        bindToken(TYPES.DependencyOptions).toDynamicValue(() => this.options);
      }
    );

    constructor(protected readonly options: DependencyOptions = defaults) {

      const { navReducerKey } = options;
      this.navReducerKey = navReducerKey;
      this.mapStateToProps = (state: any) => ({ state: state[navReducerKey] });
    }

    get AppWithNavigationState() {
      if (!this._AppWithNavigationState) {
        this._AppWithNavigationState = connect(this.mapStateToProps)(this.AppContainer);
      }
      return this._AppWithNavigationState;
    }

    get container() {
      if (!this._container) {
        this._container = createContainer(this.containerModule);
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

    protected get rootReducer() {
      if (!this._rootReducer) {
        this._rootReducer = createReducer(this.reducers, this.options);
      }
      return this._rootReducer;
    }

    protected get reducers(): ReducerMap {
      if (!this._reducers) {
        this._reducers = {
          [this.navReducerKey]: createNavigationReducer(this.AppNavigator),
        };
      }
      return this._reducers;
    }

    protected get middleware() {
      if (!this._middleware) {
        this._middleware = [
          this.sagaMiddleware,
          createReactNavigationReduxMiddleware(this.mapStateToProps),

        ];
      }
      return this._middleware;
    }

    protected get rootEnhancer() {
      if (!this._rootEnhancer) {
        const compose = createComposer(this.options.devToolOptions);
        this._rootEnhancer = compose(applyMiddleware(...this.middleware), ...this.enhancers);
      }
      return this._rootEnhancer;
    }

    protected get sagaMiddleware() {
      if (!this._sagaMiddleware) {
        this._sagaMiddleware = this.createSagaMiddleware();
      }
      return this._sagaMiddleware;
    }

    private get createdStoreResult() {
      if (!this._createdStoreResult) {
        const store = createStore(this.rootReducer, this.rootEnhancer);

        let ready: Promise<void> = Promise.resolve();
        let persistor = null;

        if (this.options.persistConfig) {

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

      Object.defineProperties(context, {
        container: {
          get: () => this.container,
        },
        dependencyOptions: {
          get: () => this.options,
        },
      });

      const sagaMiddlewareOptions = { context };

      return _createSagaMiddleware(sagaMiddlewareOptions);
    }
}

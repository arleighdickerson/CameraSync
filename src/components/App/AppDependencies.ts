import { connect } from 'react-redux';
import {
  createNavigationReducer,
  createReactNavigationReduxMiddleware,
  createReduxContainer,
} from 'react-navigation-redux-helpers';
import { TokenContainerModule } from 'inversify-token';

import * as TYPES from 'types';
import createNavigator from 'routes';
import createReduxStore, { CreatedStore } from 'store/createStore';
// import { lazyWrap } from 'util/reactUtil';
import createApp from './createApp';

const mapStateToProps = (state: any) => ({ state: state.nav });

export class AppDependencies extends TokenContainerModule {
    private _AppNavigator?: any;
    private _AppContainer?: any;
    private _AppWithNavigationState?: any;
    private _App?: any;

    private _createdStoreResult?: CreatedStore;

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

    get AppContainer() {
      if (!this._AppContainer) {
        this._AppContainer = createReduxContainer(this.AppNavigator);
      }
      return this._AppContainer;
    }

    get AppWithNavigationState() {
      if (!this._AppWithNavigationState) {
        this._AppWithNavigationState = connect(mapStateToProps)(this.AppContainer);
      }
      return this._AppWithNavigationState;
    }

    get App() {
      if (!this._App) {
        this._App = createApp(this);
      }
      return this._App;
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
        this._createdStoreResult = createReduxStore({
          reducers: {
            nav: createNavigationReducer(this.AppNavigator),
          },
          middleware: [
            createReactNavigationReduxMiddleware(mapStateToProps),
          ],
        });
      }
      return this._createdStoreResult;
    }
}

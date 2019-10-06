import * as reduxPersist from 'redux-persist';
import App from './RootContainer';
import Dependencies from './Dependencies';
import { DevToolOptions } from 'store';

export { Dependencies as AppDependencies };

export type Props = {
    dependencies: Dependencies,
    afterLift?: () => any
}

export type DependencyOptions = {
    devToolOptions: DevToolOptions,
    persistConfig?: reduxPersist.PersistConfig<any>,
    navReducerKey: string
}

export default App;

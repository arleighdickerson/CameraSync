/**
 * @format
 */

import 'core-js/es7/reflect';
import { AppRegistry } from 'react-native';
import App from './src/components/App';
import { name as appName } from './app.json';

AppRegistry.registerComponent(appName, () => App);

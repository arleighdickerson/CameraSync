/**
 * @format
 */

import { AppRegistry } from 'react-native';
import App from './src';
import { name as appName } from './app.json';
import headless from './src/headless';

AppRegistry.registerComponent(appName, () => App);
AppRegistry.registerHeadlessTask('headless', () => headless);

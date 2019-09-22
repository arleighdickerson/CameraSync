/**
 * @format
 */

import React from 'react';
import App from '../';
import dependencies from '../inversify.module';

// Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer';

it('renders correctly', async () => {
  renderer.create(<App/>);

  // prevent jest from complaining module imports after teardown
  await dependencies.ready;
});

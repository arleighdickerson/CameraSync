/**
 * @format
 */
import React from 'react';
import App from '../';
import dependencies from '../inversify.module';

// Note: test renderer must be required after react-native.
import { create, act } from 'react-test-renderer';

jest.mock('NativeAnimatedHelper');

it('renders correctly', async () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const renderer = create(<App/>);

  act(() => {
    const state = dependencies.store.getState();
    console.log(state);
  });

  await dependencies.ready;

  act(() => {
    const state = dependencies.store.getState();
    console.log(state);
  });
});

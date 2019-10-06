/**
 * @format
 */
import React from 'react';
import { AppDependencies } from '../AppDependencies';

// Note: test renderer must be required after react-native.
import { create, act } from 'react-test-renderer';

jest.mock('NativeAnimatedHelper');

it('renders correctly', async () => {
  const dependencies = new AppDependencies();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const renderer = create(<dependencies.App/>);

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

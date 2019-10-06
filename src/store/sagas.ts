import { all } from 'redux-saga/effects';

import * as modules from 'modules';

export default function* sagas() {
  yield all(Object.values(modules).map(mod => mod.saga()));
}

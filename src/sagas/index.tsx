import { all } from 'redux-saga/effects';

// import sessionSagas from './session';

export default function* rootSaga() {
  yield all([
    // sessionSagas()
  ]);
}

import { all } from 'redux-saga/effects';
import imageScan from './imageScan';

export default function* mtpSaga() {
  yield all([
    imageScan(),
  ]);
}

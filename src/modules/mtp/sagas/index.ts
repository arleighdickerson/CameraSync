import { all } from 'redux-saga/effects';
import initDevice from 'modules/mtp/sagas/initDevice';
import authorizeDevice from './authorizeDevice';

export default function* mtpSaga() {
  yield all([
    initDevice(),
    authorizeDevice(),
  ]);
}

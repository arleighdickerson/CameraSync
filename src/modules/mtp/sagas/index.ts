import { all } from 'redux-saga/effects';
import initDevice from 'modules/mtp/sagas/initDevice';
import authorizeDevice from './authorizeDevice';
import authorizeStorage from './authorizeStorage';
import scanObjectHandles from './scanObjectHandles';

export default function* mtpSaga() {
  yield all([
    initDevice(),
    authorizeDevice(),
    authorizeStorage(),
    scanObjectHandles(),
  ]);
}

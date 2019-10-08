import { createReducer } from 'typesafe-actions';
import * as actions from './actions';

type MtpState = {}

const initialState: MtpState = {};

export default createReducer(initialState as MtpState);

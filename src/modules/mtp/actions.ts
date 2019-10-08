import { makeTypes } from 'util/typeHelpers';

const types = makeTypes({
  /*
    REQUEST_STORAGE:    null,
    STORAGE_GRANTED:    null,
    STORAGE_DENIED:     null,
    REQUEST_DEVICE:     null,
    DEVICE_GRANTED:     null,
    DEVICE_DENIED:      null,
    FORGET_DEVICE:      null,
    FORGET_ALL_DEVICES: null,
     */
}, (v, k) => 'mtp/' + k);

export { types as actionTypes };

import { createReducer } from 'typesafe-actions';
import * as actions from './actions';

import { DeviceInfo, MtpObjectInfo } from './models';


export type Images = { [key: number]: MtpObjectInfo }

type State = {
    device?: DeviceInfo,
    images?: Images
}

const reducer = createReducer<State>({})
  .handleAction(actions.attachDevice, (state, action) => {
    return { device: { ...action.payload } };
  })
  .handleAction(actions.detachDevice, () => {
    return {};
  })
  .handleAction(actions.scanObjectsAsync.success, (state, action) => {
    const { images = {} } = state;

    const oldResults: MtpObjectInfo[] = Object.values(images);
    const newResults: MtpObjectInfo[] = action.payload;

    const newImages: Images = {};

    oldResults.concat(newResults).forEach(mtpObjectInfo => {
      const old = newImages[mtpObjectInfo.objectHandle];
      newImages[mtpObjectInfo.objectHandle] = { ...old, ...mtpObjectInfo };
    });

    return { ...state, images: newImages };

  });

export default reducer;

/*
.handleAction(actions.devicePermissionDenied, (state) => {
if (state !== null) {
  return {
    ...state,
    // hasPermission: false
  };
}
return state;
})
.handleAction(actions.devicePermissionGranted, (state) => {
if (state !== null) {
  return {
    ...state,
    // hasPermission: true
  };
}
return state;
});
 */

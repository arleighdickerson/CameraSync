import { getToken, TokenContainerModule } from 'inversify-token';
import * as TYPES from 'types';
import { isTest } from 'util/env';
import { NativeMtpSource } from './sources/NativeMtpSource';
import { MockMtpSource } from './sources/MockMtpSource';
import { interfaces } from 'inversify';
import { MtpSource } from 'modules/mtp/sources/MtpSource';
import { isDeviceEvent } from 'modules/mtp/models';
import * as actions from './actions';


// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default (container: interfaces.Container) => new TokenContainerModule((bindToken) => {

  // @see https://github.com/mscharley/inversify-token#usage
  bindToken(TYPES.MtpSource)
    .to(isTest ? MockMtpSource : NativeMtpSource)
    .inSingletonScope()
    .onActivation((context: interfaces.Context, mtpSource: MtpSource) => {
      const dispatch = (action: any) => getToken(context.container, TYPES.Store).dispatch(action);

      const handlers = {
        [mtpSource.EVENT_DEVICE_ATTACHED]: (evt: any) => {
          if (isDeviceEvent(evt)) {
            dispatch(actions.attachDevice(evt.payload));
          }
        },
        [mtpSource.EVENT_DEVICE_DETACHED]: (evt: any) => {
          if (isDeviceEvent(evt)) {
            dispatch(actions.detachDevice());
          }
        },
      };

      return mtpSource;
    });
});

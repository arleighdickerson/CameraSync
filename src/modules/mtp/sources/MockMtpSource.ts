import { MtpSource } from './MtpSource';
import { injectable } from 'inversify';

@injectable()
export class MockMtpSource implements MtpSource {
    readonly EVENT_MTP_SCAN = 'EVENT_MTP_SCAN';

    sync(): Promise<true> {
      return Promise.resolve(true);
    }
}

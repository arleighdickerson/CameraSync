import { MtpSource } from './MtpSource';
import { injectable } from 'inversify';
import { MtpObjectInfo } from 'modules/mtp/models';

@injectable()
export class MockMtpSource implements MtpSource {
    readonly EVENT_MTP_SCAN = 'EVENT_MTP_SCAN';

    scan(): Promise<MtpObjectInfo[]> {
      return Promise.resolve([]);
    }

    copyOne() {
      return Promise.resolve(true);
    }
}

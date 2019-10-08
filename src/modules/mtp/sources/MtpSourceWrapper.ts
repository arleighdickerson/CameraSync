import { MtpSource } from './MtpSource';
import { injectable } from 'inversify';

@injectable()
export abstract class MtpSourceWrapper implements MtpSource {
    protected abstract get delegate(): MtpSource;

    get EVENT_MTP_SCAN() {
      return this.delegate.EVENT_MTP_SCAN;
    }


    scan() {
      return this.delegate.scan();
    }
}

import { KTCoinService } from '@modules/jxmobi/services/ktcoin.service';
import { SmsService } from '@modules/sms/services';
import { forwardRef, Inject, Injectable } from '@nestjs/common';

@Injectable()
export class CommonService {
  constructor(
    @Inject(forwardRef(() => SmsService))
    private ktCoinService: KTCoinService,
  ) {}
}

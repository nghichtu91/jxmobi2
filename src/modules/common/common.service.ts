import { KTCoinService } from '@modules/jxmobi/services/ktcoin.service';
import { PaymentService } from '@modules/payment/services';
import { forwardRef, Inject, Injectable } from '@nestjs/common';

@Injectable()
export class CommonService {
  constructor(
    @Inject(forwardRef(() => KTCoinService))
    private ktCoinService: KTCoinService,
    @Inject(forwardRef(() => PaymentService))
    private paymentService: PaymentService,
  ) {}
}

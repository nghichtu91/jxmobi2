import { PaymentModule } from '@modules/payment/payment.module';
import { SmsModule } from '@modules/sms/sms.module';
import { UsersModule } from '@modules/user/user.module';
import { forwardRef, Module } from '@nestjs/common';

@Module({
  imports: [
    forwardRef(() => UsersModule),
    forwardRef(() => PaymentModule),
    forwardRef(() => SmsModule),
  ],
})
export class CommonModule {}

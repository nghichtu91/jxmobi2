import { JxMobiModule } from '@modules/jxmobi/jxmobi.module';
import { PaymentModule } from '@modules/payment/payment.module';
import { UsersModule } from '@modules/user/user.module';
import { forwardRef, Module } from '@nestjs/common';

@Module({
  imports: [
    forwardRef(() => UsersModule),
    forwardRef(() => PaymentModule),
    forwardRef(() => JxMobiModule),
  ],
})
export class CommonModule {}

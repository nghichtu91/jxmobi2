import { KTCoinEntity } from '@modules/jxmobi/entties';
import { forwardRef, Module } from '@nestjs/common';

@Module({
  imports: [
    // forwardRef(() => UsersModule),
    // forwardRef(() => PaymentModule),
    forwardRef(() => KTCoinEntity),
  ],
})
export class CommonModule {}

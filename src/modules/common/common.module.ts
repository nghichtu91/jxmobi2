import { JxMobiModule } from '@modules/jxmobi/jxmobi.module';
import { forwardRef, Module } from '@nestjs/common';

@Module({
  imports: [
    // forwardRef(() => UsersModule),
    // forwardRef(() => PaymentModule),
    forwardRef(() => JxMobiModule),
  ],
})
export class CommonModule {}

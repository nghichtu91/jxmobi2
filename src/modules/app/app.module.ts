import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccessControlModule } from 'nest-access-control';
import { PassportModule } from '@nestjs/passport';
import { ThrottlerModule } from '@nestjs/throttler';
//#region @modules
import { PaymentModule } from '@modules/payment/payment.module';
import { UsersModule } from '@modules/user/user.module';
import { AuthModule } from '@modules/auth/auth.module';
import { CommonModule } from '@modules/common/common.module';
//#endregion
import { roles } from '@/config';
import { AppController } from '@modules/app/controllers/app.controller';
import { AppService } from '@modules/app/services';

@Module({
  imports: [
    ThrottlerModule.forRoot({
      ttl: 60,
      limit: 10,
    }),
    PassportModule,
    AccessControlModule.forRoles(roles),
    AuthModule,
    CommonModule,
  ],
  controllers: [AppController],
  providers: [AppService],
  exports: [AppService],
})
export class AppModule {}

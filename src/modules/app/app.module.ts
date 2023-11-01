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
import { roles } from '@config';
import ormconfig from '@config/databases/ormconfig';
import { AppController } from '@modules/app/controllers/app.controller';
import { AppService } from '@modules/app/services';
import { SmsModule } from '@modules/sms/sms.module';

@Module({
  imports: [
    ThrottlerModule.forRoot({
      ttl: 60,
      limit: 10,
    }),
    TypeOrmModule.forRoot(ormconfig),
    PassportModule,
    AccessControlModule.forRoles(roles),
    AuthModule,
    PaymentModule,
    UsersModule,
    SmsModule,
    CommonModule,
  ],
  controllers: [AppController],
  providers: [AppService],
  exports: [AppService],
})
export class AppModule {}

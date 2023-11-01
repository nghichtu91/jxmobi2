import { UsersModule } from '@modules/user/user.module';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SmsController } from './controllers';
import { SmsEntity } from './entities/sms.entity';
import { SmsService } from './services';

@Module({
  imports: [TypeOrmModule.forFeature([SmsEntity]), UsersModule],
  providers: [SmsService],
  controllers: [SmsController],
  exports: [SmsService],
})
export class SmsModule {}

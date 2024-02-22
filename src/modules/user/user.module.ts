import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { UserEntity } from './entities';
import { UserService } from './services';
import { UserController, AdminController } from './controllers';
import { IsUserAlreadyExistConstraint } from './validators/IsUserAlreadyExist';
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import { PaymentModule } from '@modules/payment/payment.module';
import { JxMobiModule } from '@modules/jxmobi/jxmobi.module';
import { userProviders} from './user.providers';
import { DatabaseModule } from '@modules/database/database.module';

@Module({
  imports: [
    WinstonModule.forRoot({
      transports: [
        new winston.transports.File({
          filename: 'user.log',
        }),
      ],
    }),
    DatabaseModule,
    // PaymentModule,
    // JxMobiModule,
  ],
  providers: [...userProviders, IsUserAlreadyExistConstraint, UserService],
  controllers: [UserController],
  exports: [UserService],
})
export class UsersModule {}

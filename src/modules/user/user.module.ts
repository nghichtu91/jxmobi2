import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { UserEntity } from './entities';
import { UserService } from './services';
import { UserController, AdminController } from './controllers';
import { UserSubscriber } from './subscribers';
import { IsUserAlreadyExistConstraint } from './validators/IsUserAlreadyExist';
import { UserPlayTimeModule } from './playtime.module';
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';

@Module({
  imports: [
    WinstonModule.forRoot({
      transports: [
        new winston.transports.File({
          filename: 'user.log',
        }),
      ],
    }),
    TypeOrmModule.forFeature([UserEntity]),
    UserPlayTimeModule,
  ],
  providers: [IsUserAlreadyExistConstraint, UserService, UserSubscriber],
  controllers: [UserController, AdminController],
  exports: [UserService],
})
export class UsersModule {}

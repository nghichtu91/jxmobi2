import { Module } from '@nestjs/common';
import { JxmobiController } from './controllers';
import { KTCoinService } from './services/ktcoin.service';
import { KTCoinEntity } from './entties/ktcoin.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([KTCoinEntity])],
  controllers: [JxmobiController],
  providers: [KTCoinService],
})
export class JxMobiModule {}

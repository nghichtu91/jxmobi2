import { Module } from '@nestjs/common';
import { JxmobiController } from './controllers';
import { KTCoinService } from './services/ktcoin.service';
import { KTCoinEntity } from './entties/ktcoin.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RechangeService } from './services/rechange.service';
import { RechageLogsEntity } from './entties/rechageLogs.entity';

@Module({
  imports: [TypeOrmModule.forFeature([KTCoinEntity, RechageLogsEntity])],
  controllers: [JxmobiController],
  providers: [KTCoinService, RechangeService],
  exports: [KTCoinService, RechangeService],
})
export class JxMobiModule {}

import { Module } from '@nestjs/common';
import { JxmobiController } from './controllers';
import { KTCoinService } from './services/ktcoin.service';
import { KTCoinEntity } from './entties/ktcoin.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RechangeService } from './services/rechange.service';
import { RechageLogsEntity } from './entties/rechageLogs.entity';
import { TranLogsEntity } from './entties/tranlogs.entity';
import { TranlogsService } from './services/tranlogs.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([KTCoinEntity, RechageLogsEntity, TranLogsEntity]),
  ],
  controllers: [JxmobiController],
  providers: [KTCoinService, RechangeService, TranlogsService],
  exports: [KTCoinService, RechangeService, TranlogsService],
})
export class JxMobiModule {}

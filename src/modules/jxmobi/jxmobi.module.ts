import { Module } from '@nestjs/common';
import { JxmobiController } from './controllers';
import { KTCoinService } from './services/ktcoin.service';
import { KTCoinEntity } from './entties/ktcoin.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RechangeService } from './services/rechange.service';
import { RechageLogsEntity } from './entties/rechageLogs.entity';
import { TranLogsEntity } from './entties/tranlogs.entity';
import { TranlogsService } from './services/tranlogs.service';
import { GiftCodeEntity } from './entties/giftcode.entity';
import { GiftCodeService } from './services/giftcode.service';
import { GiftcodelogsEntity } from './entties/giftcodelogs.entity';
import { GiftcodelogsService } from './services/giftcodelogs.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      KTCoinEntity,
      RechageLogsEntity,
      TranLogsEntity,
      GiftCodeEntity,
      GiftcodelogsEntity,
    ]),
  ],
  controllers: [JxmobiController],
  providers: [
    KTCoinService,
    RechangeService,
    TranlogsService,
    GiftCodeService,
    GiftcodelogsService,
  ],
  exports: [
    KTCoinService,
    RechangeService,
    TranlogsService,
    GiftCodeService,
    GiftcodelogsService,
  ],
})
export class JxMobiModule {}

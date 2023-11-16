import parseDuration from 'parse-duration';
import { DataSourceOptions } from 'typeorm';

import {
  databaseCacheDuration,
  databaseEnableCache,
  databaseHost,
  databaseName,
  databasePassword,
  databasePort,
  databaseType,
  databaseUsername,
} from './mssql-config';

//#region  entites
import { UserEntity } from '@modules/user/entities';
import { KTCoinEntity } from '@modules/jxmobi/entties/ktcoin.entity';
import { RechageLogsEntity } from '@modules/jxmobi/entties/rechageLogs.entity';
import { TranLogsEntity } from '@modules/jxmobi/entties/tranlogs.entity';
import { PaymentEntity } from '@modules/payment/entities';
import { GiftCodeEntity } from '@modules/jxmobi/entties/giftcode.entity';
import { GiftcodelogsEntity } from '@modules/jxmobi/entties/giftcodelogs.entity';
//#endregion

export default {
  type: databaseType,
  host: databaseHost,
  port: databasePort,
  username: databaseUsername,
  password: databasePassword,
  database: databaseName,
  // autoLoadEntities: false,
  synchronize: false,
  migrationsRun: false,
  logging: process.env.NODE_ENV !== 'production',
  cache: databaseEnableCache
    ? { duration: parseDuration(databaseCacheDuration) }
    : false,
  entities: [
    UserEntity,
    KTCoinEntity,
    RechageLogsEntity,
    TranLogsEntity,
    PaymentEntity,
    GiftCodeEntity,
    GiftcodelogsEntity,
  ],
  options: {
    encrypt: false,
  },
} as unknown as DataSourceOptions;

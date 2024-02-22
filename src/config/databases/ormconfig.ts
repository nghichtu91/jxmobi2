import parseDuration from 'parse-duration';
import { DataSourceOptions } from 'typeorm';

import { DataSource } from 'typeorm';

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

// migrations
import { Accounts1708505839784 } from '@/migrations/1708505839784-accounts';
import { Serverlist1708505889696 } from '@/migrations/1708505889696-serverlist';

export const databaseProviders = [
  {
    provide: 'DATA_SOURCE',
    useFactory: async () => {
      const dataSource = new DataSource({
        type: 'mysql',
        host: databaseHost,
        port: databasePort,
        username: databaseUsername,
        password: databasePassword,
        database: databaseName,
        // entities: [
        //     __dirname + '/../**/*.entity{.ts,.js}',
        // ],
        entities: [
          UserEntity,
          KTCoinEntity,
          RechageLogsEntity,
          TranLogsEntity,
          PaymentEntity,
          GiftCodeEntity,
          GiftcodelogsEntity,
        ],
        synchronize: false,
        migrationsRun: true,
        migrations:[Accounts1708505839784, Serverlist1708505889696]
      });
      return dataSource.initialize();
    }
  },
]


export default {
  type: databaseType,
  host: databaseHost,
  port: databasePort,
  username: databaseUsername,
  password: databasePassword,
  database: databaseName,
  autoLoadEntities: false,
  synchronize: false,
  migrationsRun: true,
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


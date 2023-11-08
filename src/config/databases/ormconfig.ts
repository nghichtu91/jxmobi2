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

import { UserEntity } from '@modules/user/entities';
import { KTCoinEntity } from '@modules/jxmobi/entties/ktcoin.entity';
import { RechageLogsEntity } from '@modules/jxmobi/entties/rechageLogs.entity';

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
  entities: [UserEntity, KTCoinEntity, RechageLogsEntity],
  options: {
    encrypt: false,
  },
} as unknown as DataSourceOptions;

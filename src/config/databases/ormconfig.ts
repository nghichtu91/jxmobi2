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

import { UserEntity, UserPlayTimeEntity } from '@modules/user/entities';
import { PaymentEntity } from '@modules/payment/entities';
import { SmsEntity } from '@modules/sms/entities/sms.entity';

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
  entities: [UserEntity, UserPlayTimeEntity, PaymentEntity, SmsEntity],
  options: {
    encrypt: false,
  },
} as unknown as DataSourceOptions;

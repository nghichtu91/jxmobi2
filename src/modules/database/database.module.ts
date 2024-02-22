import { Module } from '@nestjs/common';
import { databaseProviders } from '@/config/databases';

@Module({
    providers: [...databaseProviders],
    exports: [...databaseProviders],
  })
  export class DatabaseModule {}

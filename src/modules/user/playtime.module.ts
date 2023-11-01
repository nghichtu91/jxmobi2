import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { UserPlaytimeService } from './services/playtime.service';
import { UserPlayTimeEntity } from './entities/playtime.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserPlayTimeEntity])],
  providers: [UserPlaytimeService],
  controllers: [],
  exports: [UserPlaytimeService],
})
export class UserPlayTimeModule {}

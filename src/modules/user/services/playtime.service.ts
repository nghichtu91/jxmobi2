import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserPlayTimeEntity } from '../entities/playtime.entity';

@Injectable()
export class UserPlaytimeService {
  constructor(
    @InjectRepository(UserPlayTimeEntity)
    private userPlayTimeRepository: Repository<UserPlayTimeEntity>,
  ) {}

  async addEndTime(username: string) {
    const playtime = this.userPlayTimeRepository.create({
      userName: username,
    });
    return this.userPlayTimeRepository.save(playtime);
  }
}

import { Logger } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { UserEntity } from '../entities';
import { Repository } from 'typeorm';

@Injectable()
export class UserRepository extends Repository<UserEntity> {
  private readonly logger = new Logger(UserRepository.name);
}

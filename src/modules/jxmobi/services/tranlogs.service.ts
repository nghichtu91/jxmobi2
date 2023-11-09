import { Injectable } from '@nestjs/common';
import { TranLogsEntity } from '../entties/tranlogs.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ITranlogsCreateDto } from '../dtos/tranlogCreate.dto';

interface ITranlogsService {
  add(tranlogCreate: ITranlogsCreateDto): void;
}

@Injectable()
export class TranlogsService implements ITranlogsService {
  constructor(
    @InjectRepository(TranLogsEntity)
    private readonly tranlogsRepo: Repository<TranLogsEntity>,
  ) {}

  add(tranlogCreate: ITranlogsCreateDto) {
    const tranLog = this.tranlogsRepo.create(tranlogCreate);
    return this.tranlogsRepo.save(tranLog);
  }
}

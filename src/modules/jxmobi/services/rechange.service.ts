interface IRechangeService {
  add(createDto: IRechangeCreateDto): void;
}

import { Repository } from 'typeorm';
import { RechageLogsEntity } from '../entties/rechageLogs.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { IRechangeCreateDto } from '../dtos/rechangeCreate.dto';

export class RechangeService implements IRechangeService {
  constructor(
    @InjectRepository(RechageLogsEntity)
    private readonly rechangeRepo: Repository<RechageLogsEntity>,
  ) {}

  add(rechangeCreateDto: IRechangeCreateDto) {
    const rechangeCreate = this.rechangeRepo.create(rechangeCreateDto);
    return this.rechangeRepo.save(rechangeCreate);
  }
}

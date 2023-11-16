import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GiftCodeEntity } from '../entties/giftcode.entity';
import { IGiftCodeCreateDto } from '../dtos/giftcode/giftcodeCreate.dto';
import { IGiftCodeFilter } from '../dtos/giftcode/giftcodeFilter.dto';

interface IGiftCodeService {
  add(createDto: IGiftCodeCreateDto): Promise<GiftCodeEntity>;
  available(code: string): Promise<GiftCodeEntity>;
  list(filter?: IGiftCodeFilter): Promise<[GiftCodeEntity[], number]>;
  use(code: string): Promise<GiftCodeEntity>;
}

@Injectable()
export class GiftCodeService implements IGiftCodeService {
  constructor(
    @InjectRepository(GiftCodeEntity)
    private readonly giftCodeReporitory: Repository<GiftCodeEntity>,
  ) {}

  /**
   * @description sử dụng giftcode
   * @param code
   */
  use(code: string): Promise<GiftCodeEntity> {
    return this.giftCodeReporitory.findOne({
      where: {
        Code: code,
      },
    });
  }

  list(): Promise<[GiftCodeEntity[], number]> {
    return this.giftCodeReporitory.findAndCount({});
  }

  /*
   */
  available(code: string): Promise<GiftCodeEntity> {
    return this.giftCodeReporitory.findOne({
      where: {
        Code: code,
      },
    });
  }

  add(createDto: IGiftCodeCreateDto) {
    const createEntity = this.giftCodeReporitory.create(createDto);
    return this.giftCodeReporitory.save(createEntity);
  }
}

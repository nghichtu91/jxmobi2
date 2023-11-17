import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Equal, Repository } from 'typeorm';
import { GiftCodeEntity } from '../entties/giftcode.entity';
import { IGiftCodeCreateDto } from '../dtos/giftcode/giftcodeCreate.dto';
import { IGiftCodeFilter } from '../dtos/giftcode/giftcodeFilter.dto';

interface IGiftCodeService {
  add(createDto: IGiftCodeCreateDto): Promise<GiftCodeEntity>;
  isExist(code: string, serverId: number): Promise<boolean>;
  list(paged: number, limit: number): Promise<[GiftCodeEntity[], number]>;
  use(code: string): Promise<GiftCodeEntity>;
  delete(id: number);
}

@Injectable()
export class GiftCodeService implements IGiftCodeService {
  constructor(
    @InjectRepository(GiftCodeEntity)
    private readonly giftCodeReporitory: Repository<GiftCodeEntity>,
  ) {}

  delete(id: number) {
    return this.giftCodeReporitory.delete({
      ID: id,
    });
  }

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

  list(paged: number, lim: number): Promise<[GiftCodeEntity[], number]> {
    const limit = Number(lim);
    const offset = (Number(paged) - 1) * limit;
    return this.giftCodeReporitory.findAndCount({
      take: limit,
      skip: offset,
    });
  }

  /*
   */
  isExist(code: string, serverId: number): Promise<boolean> {
    return this.giftCodeReporitory.exist({
      where: {
        Code: Equal(code),
        ServerID: Equal(serverId),
      },
    });
  }

  add(createDto: IGiftCodeCreateDto) {
    const createEntity = this.giftCodeReporitory.create(createDto);
    return this.giftCodeReporitory.save(createEntity);
  }
}

import { Injectable } from '@nestjs/common';
import { KTCoinEntity } from '../entties/ktcoin.entity';
import { Repository, UpdateResult } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { IKTCoinUpdate } from '../dtos/ktcoinUpdate.dto';
import { IKTCoinCreate } from '../dtos/ktcoinCreate.dto';

interface IKtcoinService {
  add(createDto: IKTCoinCreate): Promise<KTCoinEntity>;
  updateKCoin(updateDto: IKTCoinUpdate): Promise<UpdateResult>;
  exist(UserName?: string): Promise<boolean>;
}

@Injectable()
export class KTCoinService implements IKtcoinService {
  constructor(
    @InjectRepository(KTCoinEntity)
    private readonly ktcoinReporitory: Repository<KTCoinEntity>,
  ) {}

  exist(UserName?: string): Promise<boolean> {
    return this.ktcoinReporitory.exist({
      where: {
        UserName: UserName,
      },
    });
  }

  async updateKCoin({
    UserName,
    NewKCoin,
  }: IKTCoinUpdate): Promise<UpdateResult> {
    const updating = await this.ktcoinReporitory.update(
      { UserName: UserName },
      {
        KCoin: () => `KCoin + ${NewKCoin}`,
      },
    );
    return updating;
  }

  async add(createDto: IKTCoinCreate): Promise<KTCoinEntity> {
    const ktcoin = this.ktcoinReporitory.create(createDto);
    return this.ktcoinReporitory.save(ktcoin);
  }
}

import { Injectable } from '@nestjs/common';
import { KTCoinEntity } from '../entties/ktcoin.entity';
import { MoreThanOrEqual, Repository, UpdateResult } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { IKTCoinUpdate } from '../dtos/ktcoinUpdate.dto';
import { IKTCoinCreate } from '../dtos/ktcoinCreate.dto';

interface IKtcoinService {
  add(createDto: IKTCoinCreate): Promise<KTCoinEntity>;
  updateKCoin(updateDto: IKTCoinUpdate): Promise<UpdateResult>;
  exist(UserID: number): Promise<boolean>;
  available(UserID: number, coinNeed: number): Promise<boolean>;
  findOne(UserID: number): Promise<KTCoinEntity>;
}

@Injectable()
export class KTCoinService implements IKtcoinService {
  constructor(
    @InjectRepository(KTCoinEntity)
    private readonly ktcoinReporitory: Repository<KTCoinEntity>,
  ) {}

  async findOne(UserID: number): Promise<KTCoinEntity> {
    return await this.ktcoinReporitory.findOne({
      where: {
        UserID: UserID,
      },
    });
  }

  async available(UserID: number, coinNeed: number): Promise<boolean> {
    const result = await this.ktcoinReporitory.findOne({
      where: {
        UserID: UserID,
        KCoin: MoreThanOrEqual(coinNeed),
      },
    });
    return !!result;
  }

  exist(UserID: number): Promise<boolean> {
    return this.ktcoinReporitory.exist({
      where: {
        UserID: UserID,
      },
    });
  }

  async updateKCoin({
    UserID,
    NewKCoin,
  }: IKTCoinUpdate): Promise<UpdateResult> {
    const updating = await this.ktcoinReporitory.update(
      { UserID: UserID },
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

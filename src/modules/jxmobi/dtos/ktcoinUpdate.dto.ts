import { IsOptional } from 'class-validator';
import { IKTCoin } from './ktcoin.model';
import { ApiProperty } from '@nestjs/swagger';

export type IKTCoinUpdate = Pick<IKTCoin, 'UserID'> & {
  NewKCoin: number;
};

export class KTCoinUpdateDto implements IKTCoinUpdate {
  @ApiProperty()
  UserID: number;

  @IsOptional()
  @ApiProperty()
  NewKCoin: number;
}

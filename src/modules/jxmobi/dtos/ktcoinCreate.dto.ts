import { IsOptional, IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { IKTCoin } from './ktcoin.model';
import { ApiProperty } from '@nestjs/swagger';

export type IKTCoinCreate = Pick<IKTCoin, 'UserID' | 'UserName' | 'KCoin'>;

export class KTCoinCreateDto implements IKTCoinCreate {
  @IsOptional()
  @ApiProperty()
  UserID: number;

  @ApiProperty()
  @IsNotEmpty({
    message: 'Tài khoản không được bỏ trống.'
  })
  @IsString({
    message: 'Vui lòng nhập tài khoản.',
  })
  @MaxLength(32, {
    message: 'Tài khoản tối đa 32 ký tự.',
  })
  UserName?: string;

  @IsOptional()
  @ApiProperty()
  KCoin: number;
}

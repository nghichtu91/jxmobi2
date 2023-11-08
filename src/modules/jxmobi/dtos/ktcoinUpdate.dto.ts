import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';
import { IKTCoin } from './ktcoin.model';
import { ApiProperty } from '@nestjs/swagger';

export type IKTCoinUpdate = Pick<IKTCoin, 'UserName'> & {
  NewKCoin: number;
};

export class KTCoinUpdateDto implements IKTCoinUpdate {
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
  NewKCoin: number;
}

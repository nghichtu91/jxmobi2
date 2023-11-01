import { IsString, IsNotEmpty, MinLength, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IUserModel } from './user.model';

export type IChangePassWordDTO = Pick<IUserModel, 'passWord'> & {
  currentPassWord: string;
};

export class ChangePassWordDTO implements IChangePassWordDTO {
  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  @MaxLength(32)
  @ApiProperty({ description: 'Mật khẩu mới.' })
  passWord: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: 'Mật khẩu hiện tại.' })
  currentPassWord: string;
}

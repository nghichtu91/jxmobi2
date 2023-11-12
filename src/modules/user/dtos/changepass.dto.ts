import { IsString, IsNotEmpty, MinLength, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export type IChangePassWordDTO = {
  newPassWord: string;
  oldPassWord: string;
};

export class ChangePassWordDTO implements IChangePassWordDTO {
  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  @MaxLength(32)
  @ApiProperty({ description: 'Mật khẩu mới.' })
  newPassWord: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: 'Mật khẩu hiện tại.' })
  oldPassWord: string;
}

import { IUserModel } from './user.model';
import {
  IsOptional,
  IsString,
  IsNotEmpty,
  MinLength,
  MaxLength,
  Matches,
} from 'class-validator';
import { IsUserAlreadyExist } from '../validators/IsUserAlreadyExist';
import { ApiProperty } from '@nestjs/swagger';
import { Transform, TransformFnParams } from 'class-transformer';

export type ICreateUserDTO = {
  userName: string;
  phone?: string;
  passWord: string;
};

export enum UserRole {
  Admin = 'Admin',
  Moderator = 'Moderator',
  User = 'User',
}

export class CreateUserDTO implements ICreateUserDTO {
  @IsNotEmpty()
  @IsString()
  @MaxLength(16)
  @ApiProperty({ description: 'Tài khoản đăng nhập' })
  @IsUserAlreadyExist({
    message: 'Tài khoản $value đã được sử dụng.',
  })
  @Matches(/^[a-z0-9_-]{3,16}$/, {
    message: 'Tài khoản chỉ dùng số và ký tự.',
  })
  @Transform(({ value }) => value.toLowerCase())
  @Transform(({ value }: TransformFnParams) => value?.trim())
  userName: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  @MaxLength(32)
  @ApiProperty({ description: 'Mật khẩu' })
  @Transform(({ value }: TransformFnParams) => value?.trim())
  passWord: string;

  @IsOptional()
  @ApiProperty()
  @ApiProperty({ required: false })
  @Transform(({ value }: TransformFnParams) => value?.trim())
  phone?: string;
}

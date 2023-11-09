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
import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { Transform, TransformFnParams } from 'class-transformer';

export type ICreateUserDTO = Omit<IUserModel, 'ID'>;

export enum UserRole {
  Admin = 'Admin',
  Moderator = 'Moderator',
  User = 'User',
}

export class CreateUserDTO implements ICreateUserDTO {
  @IsNotEmpty()
  @IsString()
  @MaxLength(16)
  @ApiProperty({ description: 'Tài khoản đăng nhập vào game' })
  @IsUserAlreadyExist({
    message: 'Tài khoản $value đã được sử dụng.',
  })
  @Matches(/^[a-z0-9_-]{3,16}$/, {
    message: 'Tài khoản chỉ dùng số và ký tự.',
  })
  @Transform(({ value }) => value.toLowerCase())
  @Transform(({ value }: TransformFnParams) => value?.trim())
  LoginName: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  @MaxLength(32)
  @ApiProperty({ description: 'Mật khẩu vào game' })
  @Transform(({ value }: TransformFnParams) => value?.trim())
  Password: string;

  @IsOptional()
  @ApiProperty({ required: false })
  @Transform(({ value }: TransformFnParams) => value?.trim())
  Email?: string;

  @IsOptional()
  @ApiProperty()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  Phone?: string;
}

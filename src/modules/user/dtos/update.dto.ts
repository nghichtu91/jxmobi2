import { ApiProperty } from '@nestjs/swagger';
import { Transform, TransformFnParams } from 'class-transformer';
import { IsNumber, IsOptional, IsString } from 'class-validator';

import { IUserModel } from './user.model';
export type IUpdateUserDTO = Pick<
  IUserModel,
  | 'phone'
  | 'point'
  | 'answer'
  | 'email'
  | 'point2'
  | 'question'
  | 'passWordSecond'
  | 'passWord'
  | 'updateInfo'
>;

export class UpdateUserDTO implements IUpdateUserDTO {
  @IsOptional()
  @IsString()
  @ApiProperty({
    required: false,
  })
  phone?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    required: false,
  })
  passWordSecond?: string;

  @IsOptional()
  @IsNumber()
  @ApiProperty({
    required: false,
  })
  point?: number;

  @IsOptional()
  @ApiProperty({
    required: false,
  })
  email?: string;

  @IsOptional()
  @IsNumber()
  @ApiProperty({
    required: false,
  })
  point2?: number;

  @IsOptional()
  @IsString()
  @ApiProperty({
    required: false,
    description: 'Câu hỏi bí mật.',
  })
  question?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    required: false,
    description: 'Câu trả lời.',
  })
  @Transform(({ value }: TransformFnParams) => value?.trim())
  answer?: string;

  @IsOptional()
  @ApiProperty()
  newPassword?: string;

  @IsOptional()
  @ApiProperty()
  passWord?: string;

  @IsOptional()
  @ApiProperty({ description: 'Số điện cần thay đổi' })
  @Transform(({ value }: TransformFnParams) => value?.trim())
  newPhone?: string;

  @IsOptional()
  @ApiProperty({ description: 'Mật khẩu cấp 2 cần thay đổi' })
  @Transform(({ value }: TransformFnParams) => value?.trim())
  newPassWordSecond?: string;

  @IsOptional()
  @ApiProperty()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  newSecretQuestion?: string;

  @IsOptional()
  @ApiProperty()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  newAnswer?: string;

  @IsOptional()
  @ApiProperty()
  sms?: boolean;

  updateInfo?: string;
}

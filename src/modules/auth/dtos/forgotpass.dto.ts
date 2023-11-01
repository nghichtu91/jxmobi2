import { IUserModel } from '../../user/dtos/user.model';

import { ApiProperty } from '@nestjs/swagger';
import { Transform, TransformFnParams } from 'class-transformer';
import { IsOptional } from 'class-validator';

export type IForgotPassWordDTO = Pick<
  IUserModel,
  'phone' | 'answer' | 'question' | 'userName' | 'passWord'
>;

export class ForgotPassworDTO implements IForgotPassWordDTO {
  @IsOptional()
  @ApiProperty()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  passWord?: string;

  @IsOptional()
  @ApiProperty({
    required: false,
  })
  @Transform(({ value }: TransformFnParams) => value?.trim())
  phone?: string;

  @IsOptional()
  @ApiProperty({
    required: false,
  })
  @Transform(({ value }: TransformFnParams) => value?.trim())
  answer?: string;

  @IsOptional()
  @ApiProperty({
    required: false,
  })
  @Transform(({ value }: TransformFnParams) => value?.trim())
  userName?: string;

  @IsOptional()
  @ApiProperty({
    required: false,
  })
  question?: string;
}

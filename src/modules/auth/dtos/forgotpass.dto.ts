import { IUserModel } from '../../user/dtos/user.model';

import { ApiProperty } from '@nestjs/swagger';
import { Transform, TransformFnParams } from 'class-transformer';
import { IsOptional } from 'class-validator';

export type IForgotPassWordDTO = Pick<
  IUserModel,
  'Phone' | 'LoginName' | 'Password'
> & {
  newPassword?: string;
};

export class ForgotPassworDTO implements IForgotPassWordDTO {
  @IsOptional()
  @ApiProperty({
    required: false,
  })
  @Transform(({ value }: TransformFnParams) => value?.trim())
  Phone?: string;

  @IsOptional()
  @ApiProperty({
    required: false,
  })
  @Transform(({ value }: TransformFnParams) => value?.trim())
  Password: string;

  @IsOptional()
  @ApiProperty()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  newPassword?: string;

  @IsOptional()
  @ApiProperty({
    required: false,
  })
  @Transform(({ value }: TransformFnParams) => value?.trim())
  LoginName: string;
}

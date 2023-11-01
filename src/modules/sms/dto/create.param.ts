import { ISmsDTO } from './sms.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export type ICreateSmsParams = Omit<
  ISmsDTO,
  'userName' | 'action' | 'time' | 'status' | 'code' | 'id'
>;

export class CreateSmsParams implements ICreateSmsParams {
  @ApiProperty()
  @IsOptional()
  info1?: string;

  @ApiProperty()
  @IsOptional()
  info2?: string;

  @ApiProperty()
  @IsOptional()
  info3?: string;

  @ApiProperty()
  @IsOptional()
  info4?: string;

  @ApiProperty()
  @IsOptional()
  info5?: string;
}

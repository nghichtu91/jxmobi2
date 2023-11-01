import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export interface ICallbackDTO {
  code: string;
  subCode: string;
  mobile: string;
  serviceNumber: string;
  info: string;
  // REMOTE_ADDR: string;
}

export class CallbackDTO implements ICallbackDTO {
  @IsOptional()
  @ApiProperty()
  code: string;

  @IsOptional()
  @ApiProperty()
  subCode: string;

  @IsOptional()
  @ApiProperty()
  mobile: string;

  @IsOptional()
  @ApiProperty()
  serviceNumber: string;

  /**
   * id yêu cầu
   */
  @IsOptional()
  @ApiProperty()
  info: string;

  // @IsOptional()
  // @ApiProperty()
  // REMOTE_ADDR: string;
}

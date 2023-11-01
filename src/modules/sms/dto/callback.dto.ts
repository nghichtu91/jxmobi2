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
  @ApiProperty({ required: false })
  code: string;

  @IsOptional()
  @ApiProperty({ required: false })
  subCode: string;

  @IsOptional()
  @ApiProperty({ required: false })
  mobile: string;

  @IsOptional()
  @ApiProperty({ required: false })
  serviceNumber: string;

  /**
   * id yêu cầu
   */
  @IsOptional()
  @ApiProperty({ required: false })
  info: string;

  // @IsOptional()
  // @ApiProperty()
  // REMOTE_ADDR: string;

  // sv1

  @IsOptional()
  @ApiProperty({ required: false })
  phone?: string;

  @IsOptional()
  @ApiProperty({ required: false })
  shortcode?: string;

  @IsOptional()
  @ApiProperty({ required: false })
  gateway?: string;

  @IsOptional()
  @ApiProperty({ required: false })
  sms?: string;
}

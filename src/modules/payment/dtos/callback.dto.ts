import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export type IPaymentCallbackDTO = {
  status: string;
  pin?: string;
  serial?: string;
  card_type?: string;
  amount: number;
  receive_amount: number;
  noidung?: string;
  content: string;
};

export class PaymentCallbackDTO implements IPaymentCallbackDTO {
  @ApiProperty()
  @IsOptional()
  status: string;

  @ApiProperty()
  @IsOptional()
  pin?: string;

  @ApiProperty()
  @IsOptional()
  serial?: string;

  @ApiProperty()
  @IsOptional()
  card_type?: string;

  @ApiProperty()
  @IsOptional()
  amount: number;

  @ApiProperty()
  @IsOptional()
  receive_amount: number;

  @ApiProperty()
  @IsOptional()
  noidung?: string;

  @ApiProperty()
  @IsOptional()
  content: string;
}

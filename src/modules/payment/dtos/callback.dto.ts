import { StatusPayment } from '@config';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export type IPaymentCallbackDTO = {
  status: StatusPayment;
  message?: string;
  amount?: number;
  code?: string;
  serial?: string;
  request_id?: string;
  telco?: string;
};

export interface IPaymentResponse {
  trans_id?: string;
  request_id?: string;
  amount?: number;
  value?: number;
  declared_value: number;
  telco?: string;
  serial?: string;
  code?: string;
  status: string;
  message?: string;
  sign?: string;
  callback_sign?: string;
}

export interface IPaymentResponseB {
  trans_id?: string;
  request_id?: string;
  amount?: number;
  value?: number;
  declared_value: number;
  telco?: string;
  serial?: string;
  code?: string;
  status: number;
  message?: string;
  sign?: string;
}

export class PaymentCallbackDTO implements IPaymentResponse {
  @IsOptional()
  @ApiProperty()
  status: StatusPayment;

  @ApiProperty()
  @IsOptional()
  message?: string;

  @ApiProperty()
  @IsOptional()
  amount?: number;

  @ApiProperty()
  @IsOptional()
  code?: string;

  @ApiProperty()
  @IsOptional()
  serial?: string;

  @ApiProperty()
  @IsOptional()
  request_id?: string;

  @ApiProperty()
  @IsOptional()
  telco?: string;

  @IsOptional()
  @ApiProperty()
  trans_id?: string;

  @IsOptional()
  @ApiProperty()
  value: number;

  @IsOptional()
  @ApiProperty()
  declared_value: number;

  @IsOptional()
  @ApiProperty()
  sign?: string;

  @IsOptional()
  @ApiProperty()
  callback_sign?: string;
}

export class PaymentCallbackDTOB implements IPaymentResponseB {
  @IsOptional()
  @ApiProperty()
  status: number;

  @ApiProperty()
  @IsOptional()
  message?: string;

  @ApiProperty()
  @IsOptional()
  amount?: number;

  @ApiProperty()
  @IsOptional()
  code?: string;

  @ApiProperty()
  @IsOptional()
  serial?: string;

  @ApiProperty()
  @IsOptional()
  request_id?: string;

  @ApiProperty()
  @IsOptional()
  telco?: string;

  @IsOptional()
  @ApiProperty()
  trans_id?: string;

  @IsOptional()
  @ApiProperty()
  value: number;

  @IsOptional()
  @ApiProperty()
  declared_value: number;

  @IsOptional()
  @ApiProperty()
  sign?: string;
}

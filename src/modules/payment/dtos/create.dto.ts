import { IPaymentModel } from './payment.model';
import { IsNumber, IsOptional } from 'class-validator';
import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { CardTypes } from '@config';

export type ICreatePaymentDTO = Pick<
  IPaymentModel,
  | 'cardType'
  | 'cardSeri'
  | 'cardValue'
  | 'comment'
  | 'cardPin'
  | 'transactionId'
  | 'transaction'
  | 'transactionCode'
  | 'userName'
  | 'gateway'
  | 'status'
  | 'coin'
>;

export class CreatePaymentDTO implements ICreatePaymentDTO {
  @IsOptional()
  @ApiProperty({ enum: CardTypes })
  cardType?: CardTypes;

  @IsOptional()
  @ApiProperty()
  cardPin?: string;

  @IsOptional()
  @ApiProperty()
  cardSeri?: string;

  @IsOptional()
  @IsNumber()
  @ApiProperty()
  cardValue?: number;

  @ApiHideProperty()
  transactionId?: string;

  @ApiHideProperty()
  transaction?: string;

  @ApiHideProperty()
  transactionCode?: string;

  @ApiHideProperty()
  userName: string;

  @ApiHideProperty()
  gateway?: string;

  @ApiHideProperty()
  comment?: string;

  @ApiHideProperty()
  status?: number;

  @ApiHideProperty()
  coin?: number;
}

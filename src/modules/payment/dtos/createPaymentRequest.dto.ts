import { IPaymentModel } from './payment.model';
import { IsNumber, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { CardTypes } from '@config';

export type ICreatePaymentRequest = Pick<
  IPaymentModel,
  'cardType' | 'cardSeri' | 'cardValue' | 'comment' | 'cardPin'
>;

export class CreatePaymentRequest implements ICreatePaymentRequest {
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

  @ApiProperty()
  comment?: string;
}

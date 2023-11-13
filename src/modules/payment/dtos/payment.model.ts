import { CardTypes } from '@config';

export interface IPaymentModel {
  id: number;
  userName?: string;
  coin?: number;
  cardType?: CardTypes;
  cardSeri?: string;
  cardPin?: string;
  cardValue?: number;
  comment?: string;
  status?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export class PaymentModel implements IPaymentModel {
  status: number;
  id: number;
  userName?: string;
  coin?: number;
  cardType?: CardTypes;
  cardSeri?: string;
  cardPin?: string;
  cardValue?: number;
  comment?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

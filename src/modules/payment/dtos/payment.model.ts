import { CardTypes } from '@config';

export interface IPaymentModel {
  id?: string;
  userName?: string;
  coin?: number;
  gateway?: string;
  cardType?: CardTypes;
  cardSeri?: string;
  cardPin?: string;
  cardValue?: number;

  transaction?: string;
  transactionId?: string;
  transactionCode?: string;
  comment?: string;
  status?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export class PaymentModel implements IPaymentModel {
  status?: number;
  id?: string;
  userName?: string;
  coin?: number;
  gateway?: string;
  cardType?: CardTypes;
  cardSeri?: string;
  cardPin?: string;
  cardValue?: number;
  transaction?: string;
  transactionId?: string;
  transactionCode?: string;
  comment?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

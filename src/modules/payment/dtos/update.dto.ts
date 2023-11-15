import { IPaymentModel } from './payment.model';

export type IPaymentUpdateDTO = Pick<
  IPaymentModel,
  'coin' | 'status' | 'cardValue' | 'action'
>;

export class PaymentUpdateDTO implements IPaymentUpdateDTO {
  coin: number;
  status: number;
  cardValue: number;
  action?: string;
  constructor(
    coin: number,
    status: number,
    action?: string,
    cardValue?: number,
  ) {
    this.coin = coin;
    this.status = status;
    this.cardValue = cardValue;
    this.action = action;
  }
}

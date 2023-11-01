import { IPaymentModel } from './payment.model';

export type IPaymentUpdateDTO = Pick<
  IPaymentModel,
  'coin' | 'status' | 'userName' | 'gateway' | 'cardValue'
>;

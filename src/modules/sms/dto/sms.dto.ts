import { SmsActions } from '@config';

export interface ISmsDTO {
  userName: string;
  action: SmsActions;
  time: Date;
  status: number;
  code: string;
  info1?: string;
  info2?: string;
  info3?: string;
  info4?: string;
  info5?: string;
  id: number;
}

export class SmsDTO implements ISmsDTO {
  userName: string;
  action: SmsActions;
  time: Date;
  status: number;
  code: string;
  info1?: string;
  info2?: string;
  info3?: string;
  info4?: string;
  info5?: string;
  id: number;
}

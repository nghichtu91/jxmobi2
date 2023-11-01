import { SmsActions } from '@config';
import { ICreateSmsParams } from './create.param';
import { ISmsDTO } from './sms.dto';

export type ICreateSmsDTO = Omit<ISmsDTO, 'id'>;

export class CreateDTO implements ICreateSmsDTO {
  constructor(params: ICreateSmsParams) {
    this.info1 = params.info1;
    this.info2 = params.info2;
    this.info3 = params.info3;
    this.info4 = params.info4;
    this.info5 = params.info5;
  }

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
}

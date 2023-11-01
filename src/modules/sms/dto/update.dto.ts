import { ISmsDTO } from './sms.dto';

export type IUpdateSmsDTO = Pick<ISmsDTO, 'status'>;

import { GiftcodeRequest } from './giftcodeRequest.dto';
import { IGiftcodelogModel } from './giftcodelog.model';

export type IGiftCodeLogCreateDto = Pick<
  IGiftcodelogModel,
  'Code' | 'ActiveRole' | 'ServerID'
>;

export class GiftCodeLogCreateDto implements IGiftCodeLogCreateDto {
  Code: string;
  ActiveRole: number;
  ServerID: number;

  constructor({ CodeActive, RoleActive, ServerID }: GiftcodeRequest) {
    this.Code = CodeActive;
    this.ActiveRole = RoleActive;
    this.ServerID = ServerID;
  }
}

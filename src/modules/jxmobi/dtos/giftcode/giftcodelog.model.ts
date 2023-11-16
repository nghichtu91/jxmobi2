export interface IGiftcodelogModel {
  ID: number;
  Code: string;
  ActiveRole: number;
  ActiveTime: Date;
  CodeType: string;
  ServerID: number;
}

export class GiftcodelogModel implements IGiftcodelogModel {
  ID: number;
  Code: string;
  ActiveRole: number;
  ActiveTime: Date;
  CodeType: string;
  ServerID: number;
}

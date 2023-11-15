import { IKTCoin } from '@modules/jxmobi/dtos/ktcoin.model';

export interface IUserModel {
  ID: number;
  LoginName: string;
  Password: string;
  Phone?: string;
  Status?: number;
  FullName?: string;
  Email?: string;
  TokenTimeExp?: Date;
  AccessToken?: string;
  Note?: string;
  LastServerLogin?: number;
  LastLoginTime?: Date;
  KtCoin?: IKTCoin;
}

export class UserModel implements IUserModel {
  ID: number;
  LoginName: string;
  Password: string;
  Phone?: string;
  Status?: number;
  FullName?: string;
  Email?: string;
  TokenTimeExp?: Date;
  AccessToken?: string;
  Note?: string;
  LastServerLogin?: number;
  LastLoginTime?: Date;
  KtCoin?: IKTCoin;
}

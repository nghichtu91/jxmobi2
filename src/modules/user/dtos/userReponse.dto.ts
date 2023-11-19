import { ADMIN_USER, AppRoles } from '@config';
import { IUserModel } from './user.model';

export interface IUserReponseDto {
  id: number;
  userName: string;
  phone?: string;
  fullName?: string;
  roles?: string[];
  ktcoin: number;
  isNew: boolean;
  point1?: number;
}

export class UserReponseDto implements IUserReponseDto {
  id: number;
  userName: string;
  phone?: string;
  fullName?: string;
  roles?: string[];
  ktcoin: number;
  isNew: boolean;
  point1: number;

  constructor({ ID, FullName, LoginName, KtCoin, Phone }: IUserModel) {
    this.id = ID;
    this.fullName = FullName;
    this.roles = ADMIN_USER == LoginName ? [AppRoles.ADMIN] : [AppRoles.GUEST];
    this.userName = LoginName;
    this.ktcoin = KtCoin?.KCoin || 0;
    this.isNew = false;
    this.point1 = KtCoin?.KCoin || 0;
    this.phone = Phone;
  }
}

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
}

export class UserReponseDto implements IUserReponseDto {
  id: number;
  userName: string;
  phone?: string;
  fullName?: string;
  roles?: string[];
  ktcoin: number;
  isNew: boolean;

  constructor({ ID, FullName, LoginName, KtCoin }: IUserModel) {
    this.id = ID;
    this.fullName = FullName;
    this.roles = ADMIN_USER == LoginName ? [AppRoles.ADMIN] : [AppRoles.GUEST];
    this.userName = LoginName;
    this.ktcoin = KtCoin?.KCoin || 0;
    this.isNew = false;
  }
  
}

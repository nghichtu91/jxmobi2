import { ADMIN_USER, AppRoles } from '@config';
import { IUserModel } from './user.model';
import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';

export interface IUserReponseDto {
  id: number;
  userName: string;
  phone?: string;
  fullName?: string;
  roles?: string[];
  ktcoin: number;
}

export class UserReponseDto implements IUserReponseDto {
  @ApiHideProperty()
  private readonly _id: number;
  @ApiHideProperty()
  private readonly _userName: string;
  @ApiHideProperty()
  private readonly _phone?: string;
  @ApiHideProperty()
  private readonly _fullName?: string;
  @ApiHideProperty()
  private readonly _roles?: string[];

  private readonly _ktcoin: number;

  constructor({ ID, FullName, LoginName, KtCoin }: IUserModel) {
    this._id = ID;
    this._fullName = FullName;
    this._roles = ADMIN_USER == LoginName ? [AppRoles.ADMIN] : [AppRoles.GUEST];
    this._userName = LoginName;
    this._ktcoin = KtCoin?.KCoin || 0;
  }
  @ApiProperty()
  get id(): number {
    return this._id;
  }
  @ApiProperty()
  get userName(): string {
    return this._userName;
  }
  @ApiProperty()
  get phone(): string {
    return this._phone;
  }
  @ApiProperty()
  get fullName(): string {
    return this._fullName;
  }
  @ApiProperty()
  get roles(): string[] {
    return this._roles;
  }

  get ktcoin(): number {
    return this._ktcoin;
  }
}

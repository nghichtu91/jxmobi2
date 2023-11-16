import { IRechangeRequest } from './rechageRequest.dto';

export interface ITranlogsCreateDto {
  UserID: number;
  RoleID: number;
  RoleName: string;
  ServerID: number;
  Value: number;
}

export class TranlogsCreateDto implements ITranlogsCreateDto {
  private readonly _userID: number;
  private readonly _roleID: number;
  private readonly _roleName: string;
  private readonly _serverID: number;
  private readonly _value: number;
  constructor(rechangeRequest: IRechangeRequest) {
    this._roleID = rechangeRequest.RoleID;
    this._roleName = rechangeRequest.RoleName;
    this._serverID = rechangeRequest.SeverID;
    this._userID = rechangeRequest.UserID;
    this._value = rechangeRequest.Value;
  }

  get UserID() {
    return this._userID;
  }

  get RoleID() {
    return this._roleID;
  }

  get RoleName() {
    return this._roleName;
  }

  get ServerID() {
    return this._serverID;
  }

  get Value() {
    return this._value;
  }
}

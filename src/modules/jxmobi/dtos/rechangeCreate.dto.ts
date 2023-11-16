import { IRechangeRequest } from './rechageRequest.dto';

export interface IRechangeCreateDto {
  UserID: number;
  RechageType: string;
  ValueRechage: number;
}

export class RechangeCreateDto implements IRechangeCreateDto {
  private _userID: number;
  private _rechageType: string;
  private _valueRechage: number;

  constructor(rechangeRequest: IRechangeRequest) {
    this._userID = rechangeRequest.UserID;
    this._rechageType = rechangeRequest.Type == 2 ? 'Mua trong game' : '';
    this._valueRechage = rechangeRequest.Value;
  }

  get UserID() {
    return this._userID;
  }

  get RechageType() {
    return this._rechageType;
  }

  get ValueRechage() {
    return this._valueRechage;
  }
}

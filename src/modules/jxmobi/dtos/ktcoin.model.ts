export interface IKTCoin {
  ID: number;
  UserID: number;
  UserName?: string;
  KCoin: number;
  UpadateTime?: Date;
}

export class KTCoinModel implements IKTCoin {
  ID: number;
  UserID: number;
  UserName?: string;
  KCoin: number;
  UpadateTime?: Date;
}

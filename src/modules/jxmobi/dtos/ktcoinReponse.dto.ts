export interface IKTCoinReponse {
  Status: number;
  Value: number;
  Msg: string;
}

export class KTCoinReponse implements IKTCoinReponse {
  Status: number;
  Value: number;
  Msg: string;
  constructor() {
    this.Status = -1;
    this.Value = 0;
    this.Msg = 'Tài khoản không đủ token.';
  }
}

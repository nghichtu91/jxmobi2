export interface IGiftcodeResponse {
  Status: number;
  Msg: string;
  GiftItem?: string;
}

export class GiftcodeResponse implements IGiftcodeResponse {
  Status: number;
  Msg: string;
  GiftItem?: string;

  constructor() {
    this.Status = -1;
    this.Msg = 'Gift code không tồn tại';
  }
}

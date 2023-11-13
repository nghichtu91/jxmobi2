import { ICreatePaymentRequest } from './createPaymentRequest.dto';
import { IPaymentModel } from './payment.model';
import { CardTypes } from '@config';

export type ICreatePaymentDto = Omit<IPaymentModel, 'id'>;

export class CreatePaymentDto implements ICreatePaymentDto {
  private readonly _id: number;
  private readonly _userName?: string;
  private readonly _coin?: number;
  private readonly _status?: number;
  private readonly _cardType?: CardTypes;
  private readonly _cardPin?: string;
  private readonly _cardSeri?: string;
  private readonly _cardValue?: number;
  private readonly _comment?: string;

  constructor(
    { cardPin, cardSeri, cardValue, comment, cardType }: ICreatePaymentRequest,
    username: string,
    gateway?: CardTypes,
  ) {
    this._cardPin = cardPin;
    this._cardSeri = cardSeri;
    this._cardValue = cardValue;
    this._cardType = cardType || gateway;
    this._comment = comment;
    this._userName = username;
  }

  get userName() {
    return this._userName;
  }

  get cardType() {
    return this._cardType;
  }

  get cardValue() {
    return this._cardValue;
  }

  get cardPin() {
    return this._cardPin;
  }

  get cardSeri() {
    return this._cardSeri;
  }

  get comment() {
    return this._comment;
  }
}

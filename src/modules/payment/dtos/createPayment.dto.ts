import { ICreatePaymentRequest } from './createPaymentRequest.dto';
import { IPaymentModel } from './payment.model';
import { CardTypes } from '@config';

export type ICreatePaymentDto = Omit<
  IPaymentModel,
  'id' | 'method' | 'transactionId' | 'action' | 'status'
>;

export class CreatePaymentDto implements ICreatePaymentDto {
  private readonly _userName?: string;
  private readonly _cardType?: CardTypes;
  private readonly _cardPin?: string;
  private readonly _cardSeri?: string;
  private readonly _cardValue?: number;
  private readonly _comment?: string;
  private readonly _method?: string;
  private readonly _transactionId?: string;
  private readonly _action?: string;
  private readonly _status?: number;

  constructor(
    { cardPin, cardSeri, cardValue, comment, cardType }: ICreatePaymentRequest,
    username: string,
    gateway?: string,
    transactionId?: string,
    action?: string,
    status?: number,
  ) {
    this._cardPin = cardPin;
    this._cardSeri = cardSeri;
    this._cardValue = cardValue;
    this._cardType = cardType;
    this._comment = comment;
    this._userName = username;
    this._method = gateway;
    this._action = action;
    this._transactionId = transactionId;
    this._status = status || 0;
  }

  get status() {
    return this._status;
  }

  get action() {
    return this._action;
  }

  get transactionId() {
    return this._transactionId;
  }

  get method() {
    return this._method;
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

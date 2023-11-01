import {
  CARD_VALUE_EIGHT,
  CARD_VALUE_FIVE,
  CARD_VALUE_FOUR,
  CARD_VALUE_NINE,
  CARD_VALUE_ONE,
  CARD_VALUE_SECOND,
  CARD_VALUE_SEVEND,
  CARD_VALUE_SIX,
  CARD_VALUE_THIRD,
  PARTNERID,
  PARTNERKEY,
} from '@config/application';

export enum CardTypes {
  VIETTEL = 'VIETTEL',
  VINAPHONE = 'VINAPHONE',
  MOBIFONE = 'MOBIFONE',
  ATM = 'ATM',
}

export enum Gateways {
  AMT = 'atm',
  MOBI_CARD = 'mobi',
}

export enum Commands {
  'CHARGING' = 'charging',
  'CHECK' = 'check',
}

export const CardPriceList = {
  10000: CARD_VALUE_ONE,
  20000: CARD_VALUE_SECOND,
  30000: CARD_VALUE_THIRD,
  50000: CARD_VALUE_FOUR,
  100000: CARD_VALUE_FIVE,
  200000: CARD_VALUE_SIX,
  300000: CARD_VALUE_SEVEND,
  500000: CARD_VALUE_EIGHT,
  1000000: CARD_VALUE_NINE,
};

export const Cardbonus = +process.env.CARD_BONUS || 0; // tính %;
export const GATEWAY_URL = 'http://naptudong.com/chargingws/v2';
export const PARTNER_ID = PARTNERID;
export const PARTNER_KEY = PARTNERKEY;

/**
 * 
  @description 99 = CHỜ, 1 = THẺ ĐÚNG, 2 = THẺ SAI MỆNH GIÁ, 3 = THẺ LỖI, 4 = BẢO TRÌ
 */
export type StatusPayment = '1' | '2' | '3' | '4' | '99';
export enum PaymentStatus {
  PENDING = '99',
  SUCCEEDED = '1',
  FAILEDAMOUNT = '2',
  FAILED = '3',
  MAINTENANCE = '4',
}

export const ATM_KEY = process.env.ATM_KEY || 'giahuyz_vlhoiucvn';
export const ATM_RATE = +process.env.ATM_RATE || 500;
export const ATM_LINK = process.env.ATM_LINK || 'https://dantri.com.vn/';

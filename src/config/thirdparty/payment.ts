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
} from '@/config/application';

export enum CardTypes {
  VIETTEL = 'Viettel',
  VINAPHONE = 'Vinaphone',
  MOBIFONE = 'Mobifone',
  BANK = 'bank',
}

export enum Gateways {
  AMT = 'banking',
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
export const GATEWAY_URL = process.env.GATEWAY_URL;
export const PARTNER_ID = PARTNERID;
export const PARTNER_KEY = process.env.PARTNER_KEY;

/**
 * 
  @description 99 = CHỜ, 1 = THẺ ĐÚNG, 2 = THẺ SAI MỆNH GIÁ, 3 = THẺ LỖI, 4 = BẢO TRÌ
 */
export type StatusPayment = '1' | '2' | '3' | '4' | '0';
export enum PaymentStatus {
  PENDING = 0,
  SUCCEEDED = 1,
  FAILEDAMOUNT = 2,
  FAILED = 3,
  MAINTENANCE = 4,
}

export const ATM_KEY = process.env.ATM_KEY || 'giahuyz_vlhoiucvn';
export const ATM_RATE = +process.env.ATM_RATE || 500;
export const ATM_LINK = process.env.ATM_LINK || 'https://dantri.com.vn/';

export interface IRechageLogs {
  ID: number;
  UserID: number;
  CoinValue: number;
  BeforeCoin: number;
  AfterCoin: number;
  RechageType: string;
  Pram_0: string;
  Pram_1: string;
  Pram_2: string;
  Pram_3: number;
  Messenger: string;
  Status: number;
  TransID: string;
  ValueRechage: number;
  ActionBy: string;
  RechageDate: Date;
}
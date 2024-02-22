export interface IServergameDto {
  nServerOrder: number;
  nServerID: number;
  nOnlineNum?: number;
  strServerName: string;
  strStartTime?: string;
  nStatus: number;
  strURL?: string;
  nServerPort: number;
  strMaintainTxt?: string;
  strMaintainStarTime?: string;
  strMaintainTerminalTime?: string;
  Msg?: string;
}

export class ServergameDto implements IServergameDto {
  nServerOrder: number;
  nServerID: number;
  nOnlineNum?: number;
  strServerName: string;
  strStartTime?: string;
  nStatus: number;
  strURL?: string;
  nServerPort: number;
  strMaintainTxt?: string;
  strMaintainStarTime?: string;
  strMaintainTerminalTime?: string;
  Msg?: string;
}

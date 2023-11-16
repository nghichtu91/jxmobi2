export interface IGiftcodeRequest {
  RoleActive: number;
  ServerID: number;
  CodeActive: string;
}

export class GiftcodeRequest implements IGiftcodeRequest {
  RoleActive: number;
  ServerID: number;
  CodeActive: string;
}

export interface IGiftCodeUpdateDto {
  ServerID?: number;
  Code?: string;
  ItemList: string;
  MaxActive?: number;
  UserName?: string;
  Status: number;
}

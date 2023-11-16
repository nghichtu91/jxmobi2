import { ApiProperty } from '@nestjs/swagger';

export interface IGiftCodeModel {
  ID: number;
  ServerID: number;
  Code: string;
  Status: number;
  ItemList: string;
  TimeCreate: Date;
  CodeType: string;
  MaxActive: number;
  UserName: string;
}

export class GiftCodeModel implements IGiftCodeModel {
  @ApiProperty()
  ID: number;
  @ApiProperty()
  ServerID: number;
  @ApiProperty()
  Code: string;
  @ApiProperty()
  Status: number;
  @ApiProperty()
  ItemList: string;
  @ApiProperty()
  TimeCreate: Date;
  @ApiProperty()
  CodeType: string;
  @ApiProperty()
  MaxActive: number;
  @ApiProperty()
  UserName: string;
}

import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export interface IGiftCodeCreateDto {
  ServerID?: number;
  Code?: string;
  ItemList: string;
  MaxActive?: number;
  UserName?: string;
}

export class GiftCodeCreateDto implements IGiftCodeCreateDto {
  @ApiProperty()
  @IsOptional()
  ServerID?: number;

  @ApiProperty()
  @IsOptional()
  Code?: string;

  @ApiProperty()
  @IsOptional()
  ItemList: string;

  @ApiProperty()
  @IsOptional()
  MaxActive?: number;

  @ApiProperty()
  @IsOptional()
  UserName?: string;
}

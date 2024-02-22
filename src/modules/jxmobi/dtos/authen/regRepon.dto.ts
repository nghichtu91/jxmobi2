import { ApiProperty } from '@nestjs/swagger';

export interface IRegReponDto {
  ErrorCode: number;
  ErorrMsg: string;
}

export class RegReponDto implements IRegReponDto {
  constructor(errorCode: number, msg: string) {
    this.ErrorCode = errorCode;
    this.ErorrMsg  = msg;
  }
  @ApiProperty()
  ErrorCode: number;
  @ApiProperty()
  ErorrMsg: string;
}

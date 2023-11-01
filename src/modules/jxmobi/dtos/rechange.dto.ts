import { ApiProperty } from '@nestjs/swagger';

export interface IRechangeRequest {
  Value: number;
  Msg?: string;
}

interface IRechangeReponse {
  Status: number;
  Value: number;
  Msg?: string;
}

export class RechangeReponse implements IRechangeReponse {
  @ApiProperty({ type: Number })
  Status: number;
  Value: number;
  Msg?: string;
}

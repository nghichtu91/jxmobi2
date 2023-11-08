import { ApiProperty } from '@nestjs/swagger';

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

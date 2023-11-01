import { ApiProperty } from '@nestjs/swagger';

interface IRechangeReponse {
  Status: number;
}

export class RechangeReponse implements IRechangeReponse {
  @ApiProperty({ type: Number })
  Status: number;
}

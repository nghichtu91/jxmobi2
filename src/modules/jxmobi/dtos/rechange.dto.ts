import { ApiProperty } from '@nestjs/swagger';

interface IRechangeReponse {
  status: number;
}

export class RechangeReponse implements IRechangeReponse {
  @ApiProperty({ type: Number })
  status: number;
}

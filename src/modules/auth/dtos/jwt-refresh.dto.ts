import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class JwtRefreshTokenDTO {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  refreshToken: string;
}

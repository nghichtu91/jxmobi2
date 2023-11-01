import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class LoginInputDTO {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    default: 'thanhss2',
  })
  @Transform(({ value }) => value.toLowerCase())
  username: string;

  @ApiProperty({
    default: '123456789',
  })
  @IsNotEmpty()
  @IsString()
  password: string;
}

import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export type IUpdateUserDTO = {
  Password?: string;
};

export class UpdateUserDTO implements IUpdateUserDTO {
  @IsOptional()
  @IsString()
  @ApiProperty({
    required: false,
  })
  Password?: string;
}

import { ApiProperty } from '@nestjs/swagger';
import { Transform, TransformFnParams } from 'class-transformer';
import { IsOptional } from 'class-validator';

export type IAtmCallbackDTO = {
  so_tien: number;
  ten_bank?: string;
  id_khach?: string;
  ma_baoMat: string;
  trans_id?: string;
  noi_dung?: string;
};

export class AtmCallbackDTO implements IAtmCallbackDTO {
  @IsOptional()
  @ApiProperty()
  so_tien: number;

  @IsOptional()
  @ApiProperty()
  ten_bank?: string;

  @IsOptional()
  @ApiProperty()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  id_khach?: string;

  @IsOptional()
  @ApiProperty()
  ma_baoMat: string;

  @IsOptional()
  @ApiProperty()
  trans_id?: string;

  @IsOptional()
  @ApiProperty()
  noi_dung?: string;
}

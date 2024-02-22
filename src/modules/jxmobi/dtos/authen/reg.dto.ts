import { ApiProperty } from "@nestjs/swagger";
import { IsOptional } from "class-validator";

export interface IRegDTO {
    username: string;
    password: string;
};


export class RegDTO implements IRegDTO {
    @IsOptional()
    @ApiProperty({ description: 'Tài khoản đăng nhập' })
    username: string;
    @IsOptional()
    @ApiProperty({ description: 'Mật khẩu' })
    password: string;

}
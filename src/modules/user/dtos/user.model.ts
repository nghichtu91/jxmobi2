import { ApiProperty } from '@nestjs/swagger';
export interface IUserModel {
  id?: string;
  userName?: string;
  passWord?: string;
  passWordSecond?: string;
  email?: string;
  phone?: string;
  createdAt?: Date;
  //point
  point?: number;
  point1?: number;
  point2?: number;
  point3?: number;
  point4?: number;
  point5?: number;
  point6?: number;
  point7?: number;
  question?: string;
  answer?: string;
  updateInfo?: string;
  passwordNoEncrypt?: string;
  secPasswordNoEncrypt?: string;
  roles?: string[];
  iClientID?: number;
}

export class UserModel implements IUserModel {
  @ApiProperty()
  id?: string;
  @ApiProperty()
  userName?: string;

  passWord?: string;
  passWordSecond?: string;
  email?: string;

  @ApiProperty()
  phone?: string;

  createdAt?: Date;

  @ApiProperty()
  point?: number;

  @ApiProperty()
  point1?: number;
  point2?: number;
  point3?: number;
  point4?: number;
  point5?: number;
  point6?: number;
  point7?: number;

  @ApiProperty()
  question?: string;

  @ApiProperty()
  answer?: string;

  @ApiProperty()
  updateInfo?: string;

  @ApiProperty()
  passwordNoEncrypt?: string;

  @ApiProperty()
  secPasswordNoEncrypt?: string;

  @ApiProperty()
  roles?: string[];

  iClientID?: number;
  ip?: string;
}

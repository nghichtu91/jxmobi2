import { ApiProperty } from '@nestjs/swagger';
import dayjs from 'dayjs';
import { createHash } from 'node:crypto';

export interface IAuthenReponDto {
  ErrorCode: number;
  ErorrMsg: string;
  AccessToken: string;
  LastLoginTime: string;
  LastLoginIP: string;
  UserId: string;
}

export class AuthenReponDto implements IAuthenReponDto {
  constructor(username: string, userId = '1000') {
    this.UserId = userId;
    this.LastLoginIP = '127.0.0.1';
    const t = dayjs().unix().toString();
    this.LastLoginTime = t;
    // userID + userName + lastTime + isadult + key;
    this.AccessToken = createHash('md5')
      .update(userId + username + t + '1' + '9377(*)#mst9')
      .digest('hex')
      .toString();
    this.ErrorCode = 0;
  }
  @ApiProperty()
  UserId: string;
  @ApiProperty()
  ErrorCode: number;
  @ApiProperty()
  ErorrMsg: string;
  @ApiProperty()
  AccessToken: string;
  @ApiProperty()
  LastLoginTime: string;
  @ApiProperty()
  LastLoginIP: string;
}

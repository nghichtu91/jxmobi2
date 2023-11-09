import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDTO, UpdateUserDTO } from '@modules/user/dtos';
import { UserEntity } from '@modules/user/entities';
import { IReqUser } from '@shared';
import { UserService } from '@user/services';
import parseDuration from 'parse-duration';
import { ForgotPassworDTO, LoginInputDTO } from '../dtos';
import {
  ADMIN_USER,
  AppRoles,
  jwtRefreshTokenExpiration,
  jwtTokenExpiration,
} from '@config';

@Injectable()
export class AuthService {
  private logger = new Logger(AuthService.name);
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string): Promise<UserEntity> {
    const userEntity = await this.userService.findByUserName(username);
    if (userEntity && userEntity.comparePassword(password)) {
      return userEntity;
    }
    return null;
  }

  async jwtLogin(data: LoginInputDTO) {
    const { username, password } = data;
    const user = await this.validateUser(username, password);
    if (!user) {
      throw new UnauthorizedException();
    }
    return this.getAuthToken(user);
  }

  async jwtRefresh(data: IReqUser) {
    const users = await this.userService.findByUserName(data.username);
    const user = users[0];
    if (!user) {
      throw new UnauthorizedException();
    }
    return this.getAuthToken(user);
  }

  async jwtRegister(data: CreateUserDTO) {
    const user = await this.userService.create(data);
    return this.getAuthToken(user);
  }

  getAuthToken({ ID, LoginName, Email }: Partial<UserEntity>) {
    const subject = { id: ID, username: LoginName };

    const roles =
      LoginName === ADMIN_USER ? [AppRoles.ADMIN] : [AppRoles.GUEST];
    const payload = {
      id: ID,
      username: LoginName,
      email: Email,
      roles,
    };

    return {
      accessToken: this.jwtService.sign(payload, {
        expiresIn: parseDuration(jwtTokenExpiration, 's'),
      }),
      refreshToken: this.jwtService.sign(subject, {
        expiresIn: parseDuration(jwtRefreshTokenExpiration, 's'),
      }),
    };
  }

  async forgotPassword({
    LoginName,
    newPassword,
  }: ForgotPassworDTO): Promise<boolean> {
    try {
      const users = await this.userService.findByUserName(LoginName);
      if (!users) {
        throw new Error('USER_NOT_FOUND');
      }
      const update: UpdateUserDTO = { Password: newPassword || '123456789' };
      await this.userService.update(LoginName, update);
      this.logger.log(`Tài khoản ${LoginName} lấy lại mật khẩu thành công!`);
      return true;
    } catch (e: unknown) {
      const errors = e as Error;
      throw new Error(errors.message);
    }
  }
}

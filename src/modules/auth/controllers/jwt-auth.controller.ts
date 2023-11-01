import {
  Body,
  Controller,
  Post,
  HttpCode,
  HttpStatus,
  ClassSerializerInterceptor,
  UseInterceptors,
  Get,
  Res,
  HttpException,
  Ip,
} from '@nestjs/common';
import {
  ApiTags,
  ApiResponse,
  ApiUnauthorizedResponse,
  ApiOperation,
  ApiCreatedResponse,
  ApiBadRequestResponse,
  ApiBody,
} from '@nestjs/swagger';
import { CreateUserDTO } from '@modules/user/dtos';
import { JwtRefreshTokenDTO, LoginInputDTO } from '../dtos';
import { AuthService } from '../services';
import { JwtRefreshAuth, ReqUser, User } from '@shared';
import { Response } from 'express';
import { ForgotPassworDTO } from '../dtos/forgotpass.dto';

@Controller('auth')
@ApiTags('Auth')
@UseInterceptors(ClassSerializerInterceptor)
export class JwtAuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(200)
  @ApiOperation({ summary: 'Đăng nhập' })
  @ApiResponse({
    status: 200,
    description: 'Đăng nhập thành công!',
  })
  @ApiUnauthorizedResponse({
    description: 'Đăng nhập không thành công!',
  })
  async login(@Body() data: LoginInputDTO) {
    try {
      return await this.authService.jwtLogin(data);
    } catch (e: unknown) {
      throw new HttpException(
        `Tài khoản hoặc mật khẩu không đúng.`,
        HttpStatus.UNAUTHORIZED,
      );
    }
  }

  @JwtRefreshAuth()
  @Post('refresh')
  @ApiOperation({ summary: 'lấy lại token mới' })
  @ApiBody({ type: JwtRefreshTokenDTO })
  refresh(@User() user: ReqUser) {
    return this.authService.jwtRefresh(user);
  }
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Tạo tài khoản' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Tạo tại thành công!',
  })
  @ApiCreatedResponse({
    description: 'Tạo tài khoản thành công!',
  })
  @ApiBadRequestResponse({
    description: 'Có lỗi trong quá trình đăng ký!',
  })
  @ApiBody({ type: CreateUserDTO })
  register(@Ip() ip: any, @Body() data: CreateUserDTO) {
    data.ip = ip;
    return this.authService.jwtRegister(data);
  }

  @Get('logout')
  logout(@Res() res: Response) {
    return res.status(HttpStatus.OK).send();
  }

  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Lấy lại mật khẩu thành công',
  })
  @ApiBody({ type: ForgotPassworDTO })
  @Post('forgot')
  async forgotPassword(@Body() body: ForgotPassworDTO) {
    try {
      await this.authService.forgotPassword(body);
    } catch (e: unknown) {
      throw new HttpException(
        `Thông tin cung cấp không đúng.`,
        HttpStatus.BAD_GATEWAY,
      );
    }
  }
}

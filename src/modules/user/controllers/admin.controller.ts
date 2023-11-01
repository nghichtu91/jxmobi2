import {
  Controller,
  Get,
  Param,
  Patch,
  HttpStatus,
  Body,
  HttpException,
  Logger,
  Query,
} from '@nestjs/common';
import { UserService } from '../services';
import { JwtAuth, User, ReqUser, AppPermissionBuilder } from '@shared';
import {
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { IUpdateUserDTO, UpdateUserDTO } from '../dtos';
import { AppResources } from '@config';
import { InjectRolesBuilder, RolesBuilder } from 'nest-access-control';
import { PaymentService } from '@modules/payment/services';
import dayjs from 'dayjs';

@Controller('admin')
@ApiTags('Admin')
export class AdminController {
  private readonly logger = new Logger(AdminController.name);

  constructor(
    private readonly userService: UserService,
    private readonly paymentService: PaymentService,
    @InjectRolesBuilder()
    private readonly rolesBuilder: RolesBuilder,
  ) {}

  private pemission(currentUser: ReqUser) {
    return new AppPermissionBuilder()
      .setRolesBuilder(this.rolesBuilder)
      .setRequestUser(currentUser)
      .setAction('read')
      .setAction('create')
      .setAction('update')
      .setAction('delete')
      .setResourceName(AppResources.ADMIN)
      .setCreatorId(currentUser.id)
      .build()
      .grant();
  }

  private adminLog(username: string, messages: string) {
    return this.logger.warn(`Tài khoản admin ${username} ${messages}`);
  }

  @JwtAuth()
  @ApiOperation({ summary: 'Danh sách tài khoản' })
  @ApiOkResponse({
    description: 'Lấy danh sách tài khoản thành công',
  })
  @ApiResponse({
    status: HttpStatus.SERVICE_UNAVAILABLE,
    description: 'Server errors',
  })
  @ApiQuery({ name: 'paged', description: 'Trang hiện tại' })
  @ApiQuery({ name: 'limit', description: 'Số item trong 1 trang' })
  @ApiQuery({ name: 'keyword', description: 'Tài khoản cần tìm' })
  @Get('users')
  async getUsers(
    @User() currentUser: ReqUser,
    @Query('paged') paged: number,
    @Query('limit') limit = 12,
    @Query('keyword') keyword: string,
    @Query('to') to: string,
    @Query('form') form: string,
  ) {
    if (!this.pemission(currentUser).granted) {
      throw new HttpException(`Không có quyền truy cập`, HttpStatus.FORBIDDEN);
    }

    const f = form ? dayjs(form).format('YYYY-MM-DDTHH:mm:ss') : undefined;
    const t = to ? dayjs(to).format('YYYY-MM-DDTHH:mm:ss') : undefined;

    const count = await this.userService.getCount(keyword, f, t);
    const data = await this.userService.getUsers(paged, limit, keyword, f, t);
    return {
      pageNum: paged,
      total: count,
      pageSize: limit,
      data: data,
    };
  }

  @JwtAuth()
  @ApiOperation({ summary: 'Danh sách tài khoản' })
  @ApiOkResponse({
    description: 'Lấy danh sách tài khoản thành công',
  })
  @ApiResponse({
    status: HttpStatus.SERVICE_UNAVAILABLE,
    description: 'Server errors',
  })
  @ApiQuery({ name: 'paged', description: 'Trang hiện tại' })
  @ApiQuery({ name: 'limit', description: 'Số item trong 1 trang' })
  @Get('statistic/:action')
  async statistic(
    @User() currentUser: ReqUser,
    @Param('action') action: string,
    @Query('year') year?: number,
    @Query('form') form?: string,
    @Query('to') to?: string,
  ) {
    if (!this.pemission(currentUser).granted) {
      throw new HttpException(`Không có quyền truy cập`, HttpStatus.FORBIDDEN);
    }
    switch (action) {
      case 'paymentbyyear':
        return this.paymentService.staticByYear(year);
      case 'paymentformto':
        return this.paymentService.staticByFormTo(form, to);
      case 'totals':
        return {
          accounts: await this.userService.getCount(''),
          payments: await this.paymentService.count(),
          money: await this.paymentService.sumMomey(),
          moneyToday: await this.paymentService.sumMoneyToday(),
        };
      default:
        throw new HttpException(``, HttpStatus.NOT_FOUND);
    }
  }

  @JwtAuth()
  @ApiOperation({ summary: 'Thông tin tài khoản' })
  @Get('users/:id')
  @ApiParam({ name: 'id', description: 'tài khoản cần xem thông tin' })
  getUser() {
    return true;
  }

  @JwtAuth()
  @ApiOkResponse({
    description: 'Cập nhật tài khoản thành công',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Không có quyền truy cập',
  })
  @ApiOperation({ summary: 'Cập nhật thông tin tài khoản' })
  @Patch('users/:id/:action')
  @ApiParam({ name: 'id', description: 'tài khoản cần chỉnh sửa' })
  async updateUser(
    @Body() body: IUpdateUserDTO,
    @Param('id') username: string,
    @Param('action') action: string,
    @User() userCurrent: ReqUser,
  ) {
    if (!this.pemission(userCurrent).granted) {
      throw new HttpException(`Không có quyền truy cập.`, HttpStatus.FORBIDDEN);
    }
    try {
      const user = await this.userService.getUser(username);
      if (!user) {
        throw new HttpException(
          `Tài khoản ${username} không tồn tại.`,
          HttpStatus.NOT_FOUND,
        );
      }
      switch (action) {
        case 'addxu':
          await this.userService.addMoney(username, body.point);
          this.adminLog(
            userCurrent.username,
            `thêm vào tài khoản ${username} ${body.point} xu.`,
          );
          break;
        case 'unlockOrLock':
          const update: UpdateUserDTO = { point: body.point };
          await this.userService.update(username, update);
          this.adminLog(
            userCurrent.username,
            `${
              body.point === 1
                ? `mở khoá tài khoản ${username}`
                : `khoá tài khoản ${username}`
            }.`,
          );
          break;
        case 'resetaccount':
          const resetUpdate: UpdateUserDTO = {
            updateInfo: '0',
            phone: '',
            question: '',
            answer: '',
          };
          await this.userService.update(username, resetUpdate);
          break;
        default:
          break;
      }
    } catch (e: unknown) {
      const error = e as Error;
      this.logger.error(error.message);
      throw new HttpException(
        `Có lỗi từ hệ thống`,
        HttpStatus.SERVICE_UNAVAILABLE,
      );
    }
  }
}

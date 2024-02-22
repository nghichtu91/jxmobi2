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
  Post,
  Delete,
} from '@nestjs/common';
import { UserService } from '../services';
import { JwtAuth, User, ReqUser, AppPermissionBuilder } from '@/shared';
import {
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { IUpdateUserDTO } from '../dtos';
import { AppResources } from '@/config';
import { InjectRolesBuilder, RolesBuilder } from 'nest-access-control';
import { PaymentService } from '@modules/payment/services';
import { UserReponseDto } from '../dtos/userReponse.dto';
import { KTCoinService } from '@modules/jxmobi/services/ktcoin.service';
import { GiftCodeCreateDto } from '@modules/jxmobi/dtos/giftcode/giftcodeCreate.dto';
import { GiftCodeService } from '@modules/jxmobi/services/giftcode.service';
import { GiftCodeModel } from '@modules/jxmobi/dtos/giftcode/giftcode.model';
import { KTCoinCreateDto } from '@modules/jxmobi/dtos/ktcoinCreate.dto';

enum AdminAction {
  Addxu = 'addxu',
}

@Controller('admin')
@ApiTags('Admin')
export class AdminController {
  private readonly logger = new Logger(AdminController.name);

  constructor(
    private readonly userService: UserService,
    private readonly paymentService: PaymentService,
    private readonly kTCoinService: KTCoinService,
    private readonly giftCodeService: GiftCodeService,
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
  @ApiQuery({
    name: 'paged',
    description: 'Trang hiện tại',
    required: false,
  })
  @ApiQuery({
    name: 'limit',
    description: 'Số item trong 1 trang',
    required: false,
  })
  @ApiQuery({
    name: 'keyword',
    description: 'Tài khoản cần tìm',
    required: false,
  })
  @ApiQuery({
    name: 'to',
    description: 'Tài khoản cần tìm',
    required: false,
  })
  @ApiQuery({
    name: 'form',
    description: 'Tài khoản cần tìm',
    required: false,
  })
  @Get('users')
  async getUsers(
    @User() currentUser: ReqUser,
    @Query('paged') paged = 1,
    @Query('limit') limit = 12,
    @Query('keyword') keyword?: string,
  ) {
    if (!this.pemission(currentUser).granted) {
      throw new HttpException(`Không có quyền truy cập`, HttpStatus.FORBIDDEN);
    }

    // const count = await this.userService.getCount(keyword, f, t);
    const [users, count] = await this.userService.getUsers(
      paged,
      limit,
      keyword,
    );
    return {
      pageNum: paged,
      total: count,
      pageSize: limit,
      data: users.map((userEntity) => new UserReponseDto(userEntity)),
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
      // case 'paymentbyyear':
      //   return this.paymentService.staticByYear(year);
      // case 'paymentformto':
      //   return this.paymentService.staticByFormTo(form, to);
      case 'totals':
        const totalAccount = await this.userService.total();
        const totalPayment = await this.paymentService.total();
        const totalMoney = await this.paymentService.totalMoney();
        const totalMoneyToDay = await this.paymentService.totalMoney(true);
        return {
          accounts: totalAccount,
          payments: totalPayment,
          money: totalMoney,
          moneyToday: totalMoneyToDay || 0,
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
    @Body() { point }: IUpdateUserDTO,
    @Param('id') username: string,
    @Param('action') action: AdminAction,
    @User() userCurrent: ReqUser,
  ) {
    if (!this.pemission(userCurrent).granted) {
      throw new HttpException(`Không có quyền truy cập.`, HttpStatus.FORBIDDEN);
    }
    try {
      switch (action) {
        case AdminAction.Addxu:
          const userEntity = await this.userService.findByUserName(username);

          const ktupdate = new KTCoinCreateDto();
          ktupdate.KCoin = Number(point);
          ktupdate.UserID = userEntity.ID;
          ktupdate.UserName = userEntity.LoginName;

          await this.kTCoinService.updateOrCreate(ktupdate);
          this.logger.log(
            `[${AdminAction.Addxu}] tài khoản ${userCurrent.username} cộng ${point} ktcon vào tài khoản ${username}`,
          );
          break;
        default:
          break;
      }
    } catch (e: unknown) {
      const error = e as Error;
      this.logger.error(error.message);
      throw new HttpException(
        `[${AdminAction.Addxu}] Có lỗi từ hệ thống`,
        HttpStatus.SERVICE_UNAVAILABLE,
      );
    }
  }

  @JwtAuth()
  @Post('giftcodes')
  @ApiOkResponse({
    type: GiftCodeModel,
  })
  @ApiBody({
    type: GiftCodeCreateDto,
  })
  @ApiOkResponse({
    type: GiftCodeModel,
  })
  async createGift(
    @Body() body: GiftCodeCreateDto,
    @User() userCurrent: ReqUser,
  ) {
    if (!this.pemission(userCurrent).granted) {
      throw new HttpException(`Không có quyền truy cập.`, HttpStatus.FORBIDDEN);
    }

    try {
      const isExist = await this.giftCodeService.isExist(
        body.Code,
        body.ServerID,
      );
      if (isExist) {
        throw new Error(`Giftcode ${body.Code} đã tồn tại`);
      }
      return this.giftCodeService.add(body);
    } catch (e: unknown) {
      const error = e as Error;
      this.logger.error(error.message);
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @JwtAuth()
  @Get('giftcodes')
  @ApiQuery({
    name: 'keyword',
    required: false,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
  })
  @ApiQuery({
    name: 'paged',
    required: false,
  })
  async getGiftCodes(
    @User() currentUser: ReqUser,
    @Query('paged') paged = 1,
    @Query('limit') limit = 12,
    @Query('keyword') keyword?: string,
  ) {
    const [giftcodes, count] = await this.giftCodeService.list(paged, limit);
    return {
      pageNum: paged,
      total: count,
      pageSize: limit,
      data: giftcodes,
    };
  }

  @JwtAuth()
  @Delete('giftcodes/:id')
  @ApiOperation({ summary: 'Xóa gift code' })
  async deleteGiftCode(
    @User() userCurrent: ReqUser,
    @Param('id') giftcodeId: number,
  ) {
    if (!this.pemission(userCurrent).granted) {
      throw new HttpException(`Không có quyền truy cập.`, HttpStatus.FORBIDDEN);
    }
    try {
      await this.giftCodeService.delete(giftcodeId);
    } catch (e: unknown) {
      const error = e as Error;
      this.logger.error(error.message);
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}

import {
  Commands,
  Gateways,
  PARTNER_ID,
  PARTNER_KEY,
  PaymentStatus,
  CardPriceList,
  Cardbonus,
  ATM_KEY,
  ATM_RATE,
  AppResources,
  BOT_CHAT_ID,
  CardTypes,
  ATM_VALUE_ONE,
  ATM_VALUE_SECOND,
  ATM_VALUE_THIRD,
} from '@config';
import {
  Injectable,
  Controller,
  Post,
  Body,
  Param,
  HttpException,
  HttpStatus,
  Get,
  Logger,
  Query,
} from '@nestjs/common';
import {
  ApiBody,
  ApiNotFoundResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuth, ReqUser, User, AppPermissionBuilder } from '@shared';
import {
  CreatePaymentRequest,
  ICreatePaymentRequest,
} from '../dtos/createPaymentRequest.dto';
import { PaymentService } from '../services';
import { UserService } from '@modules/user/services';
import { ISearchPaymentParams } from '../dtos';
import { PaymentEntity } from '../entities';
import dayjs from 'dayjs';
import { InjectRolesBuilder, RolesBuilder } from 'nest-access-control';
import { CreatePaymentDto } from '../dtos/createPayment.dto';

interface IPageReponse<T> {
  pageNum: number;
  pageSize: number;
  total: number;
  data: T[];
}

@Injectable()
@Controller('payments')
@ApiTags('Payment')
export class PaymentController {
  private readonly logger = new Logger(PaymentController.name);

  constructor(
    private readonly paymentService: PaymentService,
    private readonly userService: UserService,
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

  /**
   * @description tính số xu được cộng vào tài khoản.
   * @param price
   * @returns
   */
  getCoin(price: string | number) {
    this.logger.log(
      `[Xu nhận được] ${CardPriceList[price]} khuyến mãi thêm ${
        Cardbonus * CardPriceList[price]
      }`,
    );
    const bonus = CardPriceList[price] * Cardbonus;
    return Math.floor(CardPriceList[price] + bonus);
  }

  getCoinForAtm(price: number) {
    let bonus = 1;
    if (price < 1100000) {
      bonus = ATM_VALUE_ONE;
    }
    if (price >= 1100000 && price < 2000000) {
      bonus = ATM_VALUE_SECOND;
    }
    if (price >= 2000000 && price <= 20000000) {
      bonus = ATM_VALUE_THIRD;
    }
    return Math.floor((price / ATM_RATE) * bonus);
  }

  @Get(':username')
  @JwtAuth({
    resource: AppResources.USER,
    action: 'read',
    possession: 'any',
  })
  @ApiOperation({
    summary: 'Danh sách lịch sử nạp',
  })
  async listHistory() {}

  @Get('admin/histories')
  @JwtAuth({
    resource: AppResources.USER,
    action: 'read',
    possession: 'any',
  })
  @ApiOperation({
    summary: 'Danh sách lịch sử nạp',
  })
  async adminHistories(
    @User() currentUser: ReqUser,
    @Query('paged') paged: number,
    @Query('limit') limit = 12,
    @Query('keyword') keyword: string,
    @Query('to') to: string,
    @Query('form') form: string,
    @Query('status') status: number,
  ) {
    if (!this.pemission(currentUser).granted) {
      throw new HttpException(`Không có quyền truy cập`, HttpStatus.FORBIDDEN);
    }
    const f = form ? dayjs(form).format('YYYY-MM-DDTHH:mm:ss') : undefined;
    const t = to ? dayjs(to).format('YYYY-MM-DDTHH:mm:ss') : undefined;

    const filters: ISearchPaymentParams = {
      form: f,
      to: t,
      keyword,
      limit,
      status,
    };

    const total = await this.paymentService.total(filters);
    // const payments = await this.paymentService.list(paged, filters);

    const vv: IPageReponse<PaymentEntity> = {
      pageNum: paged,
      pageSize: 12,
      total: total,
      data: [],
    };
    return vv;
  }

  //#region payment
  /**
   * @description api nạp thẻ và ghi thẻ vào đợi kiểm tra
   * @param {Gateways} gateway
   * @param {CreatePaymentDTO} body
   * @param {ReqUser} currentUser
   * @returns
   */
  @Post('gateway/:gateway')
  @JwtAuth()
  @ApiOperation({ summary: 'Nạp thẻ' })
  @ApiBody({ type: CreatePaymentRequest })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Ghi thẻ thành công',
  })
  @ApiNotFoundResponse({ description: 'Cổng nạp không hỗ trợ.' })
  async checkout(
    @Param('gateway') gateway: Gateways,
    @Body() body: ICreatePaymentRequest,
    @User() { username }: ReqUser,
  ) {
    if (!Object.values(Gateways).includes(gateway)) {
      throw new HttpException(
        'Cổng nạp không hỗ trợ phương thức thanh toán này!',
        400,
      );
    }

    const createDto = new CreatePaymentDto(body, username);
    return this.paymentService.add(createDto);
  }
  //#endregion
}

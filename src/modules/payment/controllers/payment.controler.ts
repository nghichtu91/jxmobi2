import {
  Gateways,
  CardPriceList,
  Cardbonus,
  ATM_RATE,
  AppResources,
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
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuth, ReqUser, User, AppPermissionBuilder } from '@shared';
import {
  CreatePaymentRequest,
  ICreatePaymentRequest,
} from '../dtos/createPaymentRequest.dto';
import { PaymentService } from '../services';
import { ISearchPaymentParams } from '../dtos';
import { PaymentEntity } from '../entities';
import dayjs from 'dayjs';
import { InjectRolesBuilder, RolesBuilder } from 'nest-access-control';
import { CreatePaymentDto } from '../dtos/createPayment.dto';
import { KTCoinService } from '@modules/jxmobi/services/ktcoin.service';
import { PaymentUpdateDTO } from '../dtos/update.dto';

interface IPageReponse<T> {
  pageNum: number;
  pageSize: number;
  total: number;
  data: T[];
}

enum PaymentAdminActions {
  ACCEPT = 'accept',
  REJECT = 'reject',
}

@Injectable()
@Controller('payments')
@ApiTags('Payment')
export class PaymentController {
  private readonly logger = new Logger(PaymentController.name);

  constructor(
    private readonly paymentService: PaymentService,
    private readonly ktcoinService: KTCoinService,
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
  async listHistory() {
    return true;
  }

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
    @Query('status') status = 0,
  ): Promise<IPageReponse<PaymentEntity>> {
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
    const [payments, count] = await this.paymentService.list(paged, filters);
    return {
      pageNum: paged,
      pageSize: 12,
      total: count,
      data: payments,
    };
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

    const createDto = new CreatePaymentDto(body, username, gateway);
    return this.paymentService.add(createDto);
  }
  //#endregion

  @Post(':username/:payment/:action')
  @JwtAuth()
  @ApiOperation({ summary: 'Nạp thẻ' })
  @ApiParam({
    name: 'value',
    type: Number,
    required: false,
    description: 'Cần chỉnh lại mệnh giá cho payment',
  })
  async paymentactions(
    @User() currentUser: ReqUser,
    @Param('payment') id: number,
    @Param('username') username: string,
    @Param('action') action: PaymentAdminActions,
    @Body('value') value: number,
  ) {
    if (!this.pemission(currentUser).granted) {
      throw new HttpException(`Không có quyền truy cập`, HttpStatus.FORBIDDEN);
    }
    const payment = await this.paymentService.get(id);

    if (!payment) {
      return new HttpException(`Không tìm thấy payment`, HttpStatus.NOT_FOUND);
    }
    try {
      switch (action) {
        case PaymentAdminActions.ACCEPT:
          await this.ktcoinService.updateKCoinByUserName(
            username,
            payment?.cardValue,
          );
          const updatePaymentDto = new PaymentUpdateDTO(
            payment?.cardValue,
            1,
            'admin',
            payment.cardValue,
          );
          this.paymentService.update(id, updatePaymentDto);
          this.logger.log(
            `[${action}] ${currentUser.username} đã duyệt payment ${id}, có mệnh giá là: ${payment?.cardValue}`,
          );
          return new HttpException(`Đã duyệt payment`, HttpStatus.ACCEPTED);
        case PaymentAdminActions.REJECT:
          this.paymentService.updateStatus(id, -1, undefined, 'admin');
          this.logger.log(
            `[${action}] ${currentUser.username} đã từ chối payment ${id}, có mệnh giá là: ${payment?.cardValue}`,
          );
          return new HttpException(
            `Payment bị từ chối`,
            HttpStatus.BAD_REQUEST,
          );
        default:
          return new HttpException(
            `Hành động không hỗ trợ`,
            HttpStatus.NOT_FOUND,
          );
      }
    } catch (ex: unknown) {
      throw new HttpException(
        'Có lỗi từ hệ thống.',
        HttpStatus.SERVICE_UNAVAILABLE,
      );
    }
  }
}

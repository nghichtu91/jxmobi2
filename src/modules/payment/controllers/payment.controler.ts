import {
  Gateways,
  CardPriceList,
  Cardbonus,
  ATM_RATE,
  AppResources,
  ATM_VALUE_ONE,
  ATM_VALUE_SECOND,
  ATM_VALUE_THIRD,
  GATEWAY_URL,
  PARTNER_KEY,
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
import { HttpService } from '@nestjs/axios';
import qs from 'qs';
import { catchError, firstValueFrom } from 'rxjs';
import { AxiosError } from 'axios';

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

interface CheckCardReponse {
  msg: string;
  status: any;
  title: string;
  amount?: number;
}
@Injectable()
@Controller('payments')
@ApiTags('Payment')
export class PaymentController {
  private readonly logger = new Logger(PaymentController.name);

  constructor(
    private readonly paymentService: PaymentService,
    private readonly ktcoinService: KTCoinService,
    private readonly httpService: HttpService,
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
  async listHistory(
    @Query('paged') paged: number,
    @Query('limit') limit = 12,
    @User() { username }: ReqUser,
  ) {
    const filters: ISearchPaymentParams = {
      keyword: username,
      limit,
    };
    const [payments, count] = await this.paymentService.historiesByUserName(
      paged,
      filters,
    );
    return {
      pageNum: paged,
      pageSize: limit,
      total: count,
      data: payments,
    };
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
      pageSize: limit,
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
        HttpStatus.NOT_FOUND,
      );
    }

    const data = qs.stringify({
      APIkey: PARTNER_KEY,
      mathe: body.cardPin,
      seri: body.cardSeri,
      type: body.cardType,
      menhgia: body.cardValue,
      content: '1548845151',
    });

    const config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: GATEWAY_URL,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Cookie:
          'XSRF-TOKEN=eyJpdiI6Imp5dUpFQkxYaEVZbzNnMTA3dGx3QXc9PSIsInZhbHVlIjoiOWdlYnRqODBkVkJBbjVDRzZHVVlvSUdwSW9HWVgxN1N3aDdyUEFOcjFEVTE5WWNNSFhiZkRWbnhiL2RITFRpbXJwbks4SjFlcGRTRXFtTXJNV3dHL2xOK0Z6NDNrK2hZRCtyU0IwRFZaUjMvYWx5VkFLTVZzUVh0dFJiS2locUoiLCJtYWMiOiI2MmIxZWQwM2QxNjhlZGI1MzMwZDBmNjRiNjc0Njg1ZTczMWM0MTIwM2FmMzRlMzE1MTk2OGZmNDQ0ZWVkMjhkIiwidGFnIjoiIn0%3D; laravel_session=Z194Oa47VlLrnmG44FH2BUg37Xcq9yuvflBLaYmx',
      },
      data: data,
    };

    try {
      const { data } = await firstValueFrom(
        this.httpService.request<CheckCardReponse>(config).pipe(
          catchError((error: AxiosError) => {
            this.logger.error(error.response.data);
            throw 'An error happened!';
          }),
        ),
      );
      //       "00" -> Thẻ thành công
      // "99" -> thẻ sai mệnh giá
      // "-10" -> thẻ sai
      // "-9" -> thẻ chờ duyệt
      // "2" -> lỗi không kiểm tra được!
      console.log(data);
      switch (data.status) {
        case '00':
          const createDto = new CreatePaymentDto(body, username, gateway);
          await this.paymentService.add(createDto);
          break;
        case -10:
        case '-10':
          return new HttpException(data.msg, HttpStatus.BAD_GATEWAY);
        case -9:
        case '-9':
          return new HttpException(
            'Thẻ đang chờ kiểm duyệt',
            HttpStatus.ACCEPTED,
          );
        case 2:
        case '2':
          return new HttpException(data?.msg, HttpStatus.ACCEPTED);
        default:
          break;
      }
    } catch (ex) {
      return new HttpException(
        'Lỗi nạp thẻ, vui lòng giữ lại thẻ.',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
  //#endregion

  @Post(':payment/:action')
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
            payment.userName,
            payment?.cardValue,
          );
          const updatePaymentDto = new PaymentUpdateDTO(
            payment?.cardValue,
            1,
            currentUser.username,
            payment.cardValue,
          );
          this.paymentService.update(id, updatePaymentDto);
          this.logger.log(
            `[${action}] ${currentUser.username} đã duyệt payment ${id}, có mệnh giá là: ${payment?.cardValue}`,
          );
          return new HttpException(`Đã duyệt payment`, HttpStatus.ACCEPTED);
        case PaymentAdminActions.REJECT:
          this.paymentService.updateStatus(id, 3, undefined, 'admin');
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

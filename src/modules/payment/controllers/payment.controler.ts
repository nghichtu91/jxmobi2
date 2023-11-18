import {
  Gateways,
  AppResources,
  GATEWAY_URL,
  PARTNER_KEY,
  PaymentStatus,
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
import { ApiBody, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { JwtAuth, ReqUser, User, AppPermissionBuilder } from '@shared';
import {
  CreatePaymentRequest,
  ICreatePaymentRequest,
} from '@modules/payment/dtos/createPaymentRequest.dto';
import { PaymentService } from '../services';
import {
  IPaymentCallbackDTO,
  ISearchPaymentParams,
  PaymentCallbackDTO,
} from '../dtos';
import { PaymentEntity } from '@modules/payment/entities';
import dayjs from 'dayjs';
import { InjectRolesBuilder, RolesBuilder } from 'nest-access-control';
import { CreatePaymentDto } from '../dtos/createPayment.dto';
import { KTCoinService } from '@modules/jxmobi/services/ktcoin.service';
import { PaymentUpdateDTO } from '../dtos/update.dto';
import { HttpService } from '@nestjs/axios';
import qs from 'qs';
import { firstValueFrom } from 'rxjs';
import randomstring from 'randomstring';

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
  transaction_id?: string;
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

    const cardInfo = qs.stringify({
      APIkey: PARTNER_KEY,
      mathe: body.cardPin,
      seri: body.cardSeri,
      type: body.cardType,
      menhgia: body.cardValue,
      content: new Date().getTime(),
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
      data: cardInfo,
    };

    const { data, status } = await firstValueFrom(
      this.httpService.request<CheckCardReponse>(config).pipe(),
    );
    if (status !== 200) {
      this.logger.error('Hệ thống nạp có lỗi');
      throw new HttpException(
        'Hệ thống thẻ cào đang bảo trì.',
        HttpStatus.SERVICE_UNAVAILABLE,
      );
    }

    if (data?.status != '00') {
      throw new HttpException(data.msg, HttpStatus.BAD_GATEWAY);
    }

    const content = randomstring.generate({
      length: 15,
    });

    const createDto = new CreatePaymentDto(
      { ...body, cardValue: data.amount, comment: `${username}-${content}` },
      username,
      gateway,
      data.transaction_id,
      'auto',
      PaymentStatus.PENDING,
    );
    await this.paymentService.add(createDto);
    throw new HttpException(
      'Ghi thẻ thành công, vui lòng đợi kiểm tra.',
      HttpStatus.ACCEPTED,
    );
  }

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
    console.log(value);
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

  @Post('mobicallback')
  @ApiBody({
    type: PaymentCallbackDTO,
  })
  @ApiOperation({ summary: 'Callback thẻ nạp' })
  async mobicallback(@Body() body: IPaymentCallbackDTO) {
    if (body.status != 'thanhcong') {
      this.paymentService.updateByContent(body.content, PaymentStatus.FAILED);
      throw new HttpException('Thẻ cào sai', HttpStatus.BAD_REQUEST);
    } else {
      try {
        const payment = await this.paymentService.getByContent(body.content);
        this.paymentService.updateByContent(
          body.content,
          PaymentStatus.SUCCEEDED,
        );
        this.ktcoinService.updateKCoinByUserName(
          payment.userName,
          body.receive_amount,
        );
      } catch (e) {
        this.logger.warn(
          `[mobicallback] payment ${body.content}, thẻ đúng nhưng có lỗi trong quá trình cộng ktcoin.`,
        );
      }
    }
  }
}

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
import {
  JwtAuth,
  ReqUser,
  User,
  CreateMD5,
  AppPermissionBuilder,
} from '@shared';
import { PaymentCallbackDTO } from '../dtos/callback.dto';
import { CreatePaymentDTO } from '../dtos/create.dto';
import { PaymentService } from '../services';
import { firstValueFrom } from 'rxjs';
import { UserService } from '@modules/user/services';
import { AtmCallbackDTO, ISearchPaymentParams } from '../dtos';
import { PaymentEntity } from '../entities';
import { TelegramService } from 'nestjs-telegram';
import dayjs from 'dayjs';
import { InjectRolesBuilder, RolesBuilder } from 'nest-access-control';

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
    private readonly telegramSevice: TelegramService,
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
    @Param('username') username: string,
    @Query('paged') paged: number,
  ) {
    const total = await this.paymentService.getTotalByUserName(username);
    const payments = await this.paymentService.getPaymentsByUsername(
      username,
      paged,
    );

    const vv: IPageReponse<PaymentEntity> = {
      pageNum: paged,
      pageSize: 12,
      total: total,
      data: payments,
    };
    return vv;
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
    const payments = await this.paymentService.list(paged, filters);

    const vv: IPageReponse<PaymentEntity> = {
      pageNum: paged,
      pageSize: 12,
      total: total,
      data: payments,
    };
    return vv;
  }

  @Post('callback-mobicard')
  @ApiOperation({
    summary: 'callback thẻ nạp',
  })
  @ApiBody({ type: PaymentCallbackDTO })
  async cardCallback(@Body() body: PaymentCallbackDTO) {
    const {
      status,
      trans_id,
      value,
      message,
      code,
      serial,
      declared_value,
      callback_sign,
    } = body;

    const signStr = CreateMD5(`${PARTNER_KEY}${code}${serial}`);
    this.logger.log(JSON.stringify(body));

    const paylog = await this.paymentService.getUserNameByTransId(trans_id);
    if (!paylog) {
      this.logger.error(`[cardCallback] không tìm thấy ${trans_id}`, '');
      throw new HttpException(
        `Không tìm thấy mã giao dịch!`,
        HttpStatus.BAD_REQUEST,
      );
    }
    this.logger.log(
      `[cardCallback][${trans_id}] Đổi trạng thái từ ${paylog.status} ----> ${status}`,
    );
    switch (status) {
      // card sai mệnh giá
      case PaymentStatus.FAILEDAMOUNT:
        this.paymentService.updateStatus(
          trans_id,
          parseInt(status),
          `Khai báo ${declared_value} giá trị thẻ là ${value}`,
        );
        this.logger.log(
          `[cardCallback][${trans_id}] Tài khoản ${paylog.userName} nạp thẻ nhưng sai mệnh giá. Giá trị thật là ${body.value}, giá khai báo ${body.declared_value}.`,
        );
        throw new HttpException(`Thẻ sai mệnh giá`, HttpStatus.BAD_REQUEST);
      // card đúng
      case PaymentStatus.SUCCEEDED:
        if (callback_sign !== signStr) {
          this.logger.error(
            `[cardCallback] chữ ký sai ${callback_sign} # ${signStr} ${PARTNER_KEY}${code}${serial}`,
          );
          throw new HttpException(`Chữ ký không đúng.`, HttpStatus.BAD_REQUEST);
        }
        const coin = this.getCoin(value);
        this.logger.log(
          `[cardCallback][${trans_id}] Tài khoản ${paylog.userName} nạp thẻ thành công, mệnh giá ${body.value} nhận được ${coin}.`,
        );
        this.paymentService.update(trans_id, {
          coin: coin,
          status: parseInt(status),
          userName: paylog.userName,
          gateway: paylog.gateway,
          cardValue: paylog.cardValue,
        });
        try {
          await this.userService.addMoney(paylog.userName, coin);
        } catch (e) {
          this.telegramSevice
            .sendMessage({
              text: `Có lỗi cộng xu cho tài khoản ${paylog.userName} với số xu là: ${coin}`,
              chat_id: BOT_CHAT_ID,
            })
            .toPromise();
        }
        break;
      default:
        this.paymentService.updateStatus(trans_id, parseInt(status), message);
        this.logger.log(`[cardCallback][${trans_id}] Thẻ lỗi.`);
        throw new HttpException(`Thẻ lỗi`, HttpStatus.BAD_REQUEST);
    }
  }

  @Post('callback-atm')
  @ApiOperation({
    summary: 'callback atm',
  })
  async atmCallback(@Body() body: AtmCallbackDTO) {
    const { so_tien, ten_bank, trans_id, id_khach, ma_baoMat } = body;
    if (ma_baoMat !== ATM_KEY) {
      this.logger.error('[AtmCallback] mã bảo mật không đúng!');
      throw new HttpException(`Mã bảo mật không đúng!`, 400);
    }
    if (!id_khach) {
      throw new HttpException(`Tài khoản không có.`, 400);
    }

    if (so_tien < 50000) {
      this.logger.error('[AtmCallback] Số tiền nhỏ hơn 20.000 vnd!');
      throw new HttpException(`Số tiền nhỏ hơn 50.000 vnd!`, 400);
    }
    const user = await this.userService.findByUserName(id_khach);
    if (!user[0]) {
      throw new HttpException(`Không tìm thấy tài khoản ${id_khach}`, 400);
    }
    const coin = this.getCoinForAtm(so_tien);
    const newPaymentData: CreatePaymentDTO = {
      cardValue: so_tien,
      userName: id_khach,
      transactionId: trans_id,
      transactionCode: trans_id,
      gateway: 'atm',
      comment: `${ten_bank}`,
      status: 1,
      coin: coin,
      cardType: CardTypes.ATM,
    };
    this.paymentService.instert(newPaymentData);
    try {
      await this.userService.addMoney(id_khach, coin);
      this.logger.log(
        `[AtmCallback] tài khoản ${id_khach} nạp ${so_tien} vnd, nhận được ${coin} xu.`,
      );
    } catch (e) {
      this.telegramSevice
        .sendMessage({
          text: `Có lỗi cộng xu cho tài khoản ${id_khach} với số xu là: ${coin}`,
          chat_id: BOT_CHAT_ID,
        })
        .toPromise();
      this.logger.error(
        `[AtmCallback] tài khoản ${id_khach} có lỗi trong quá trình cộng xu, số xu chưa cộng được ${coin}`,
      );
    }
    return true;
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
  @ApiBody({ type: CreatePaymentDTO })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Ghi thẻ thành công',
  })
  @ApiNotFoundResponse({ description: 'Cổng nạp không hỗ trợ.' })
  async checkout(
    @Param('gateway') gateway: Gateways,
    @Body() body: CreatePaymentDTO,
    @User() currentUser: ReqUser,
  ) {
    if (!Object.values(Gateways).includes(gateway)) {
      throw new HttpException(
        'Cổng nạp không hỗ trợ phương thức thanh toán này!',
        400,
      );
    }

    if (!Object.keys(CardPriceList).includes(body.cardValue.toString())) {
      throw new HttpException('Cổng nạp không hỗ trợ mệnh giá này!', 400);
    }

    const { username } = currentUser;
    if (Gateways.MOBI_CARD === gateway) {
      const { cardPin, cardSeri, cardType, cardValue } = body;
      const request_id = `${username}${cardSeri}`;
      const signStr = `${PARTNER_KEY}${cardPin}${Commands.CHARGING}${PARTNER_ID}${request_id}${cardSeri}${cardType}`;
      const sign = CreateMD5(signStr);
      const cardInfo = {
        telco: cardType,
        code: cardPin,
        serial: cardSeri,
        amount: cardValue,
        request_id: request_id,
        partner_id: PARTNER_ID,
        command: Commands.CHARGING,
        sign: sign,
      };
      const { data } = await firstValueFrom(
        this.paymentService.checkCardMobi(cardInfo).pipe(),
      );
      console.log(data);
      //add field miss
      const newPaymentData: CreatePaymentDTO = {
        ...body,
        cardValue: cardValue,
        userName: username,
        transactionId: request_id,
        transactionCode: data.trans_id,
        gateway: gateway,
        comment: data.message,
        status: data.status,
      };
      switch (data.status) {
        // card lỗi
        case 3:
          throw new HttpException(
            'Thẻ không đúng, vui lòng sử dụng thẻ khác!',
            HttpStatus.PAYMENT_REQUIRED,
          );
        // hệ thống bảo trì
        case 4:
          throw new HttpException(
            'Hệ thống nạp thể đang bảo trì, vui lòng sử dụng lại sau.',
            HttpStatus.ACCEPTED,
          );
        // card đang chờ
        case 99:
          newPaymentData.comment = '';
          this.paymentService.instert(newPaymentData);
          throw new HttpException(
            'Thẻ được thêm vào hệ thống, đang đợi kiểm tra!',
            HttpStatus.ACCEPTED,
          );
        // card sai mệnh giá
        case 2:
          this.logger.log(
            `[checkout][${data.trans_id}] Tài khoản ${username} nạp thẻ thành công, nhưng sai mệnh giá. Giá trị thật là ${data.value}, giá khai báo ${data.declared_value}.`,
          );
          throw new HttpException('Thẻ sai mệnh giá!', HttpStatus.BAD_REQUEST);
        // card đúng
        case 1:
          const coin = this.getCoin(data.value);
          newPaymentData.coin = coin;
          newPaymentData.cardValue = data.value;
          this.paymentService.instert(newPaymentData);
          this.userService.addMoney(currentUser.username, coin);
          this.logger.log(
            `[checkout][${data.trans_id}] Tài khoản ${username} nạp thẻ thành công, mệnh giá ${data.value} nhận được ${coin}.`,
          );
          throw new HttpException(
            1 === data.status
              ? 'Nạp thẻ thành công, chúc bạn chơi game vui vẻ!'
              : 'Thẻ được thêm vào hệ thống, nhưng sai mệnh giá.',
            HttpStatus.CREATED,
          );
        case 102:
          throw new HttpException(
            'Yêu cầu nạp thẻ đã tồn tại, vui lòng sử dụng thẻ khác.',
            HttpStatus.BAD_REQUEST,
          );
        default:
          this.logger.error(data.message, currentUser.username);
          throw new HttpException(
            'Có lỗi vui lòng thử lại sau!',
            HttpStatus.BAD_REQUEST,
          );
      }
    }
  }
  //#endregion
}

import {
  Query,
  Controller,
  Get,
  Logger,
  Post,
  Body,
  HttpException,
  HttpStatus,
  Put,
} from '@nestjs/common';
import { ApiOkResponse, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { RechangeReponse } from '../dtos/rechange.dto';
import { KTCoinCreateDto } from '../dtos/ktcoinCreate.dto';
import { KTCoinService } from '../services/ktcoin.service';
import { QueryFailedError } from 'typeorm';
import { KTCoinUpdateDto } from '../dtos/ktcoinUpdate.dto';
import { RechangeService } from '../services/rechange.service';
import { IRechangeRequest } from '../dtos/rẹchageRequest.dto';
import { RechangeCreateDto } from '../dtos/rechangeCreate.dto';
import { TranlogsService } from '../services/tranlogs.service';
import { TranlogsCreateDto } from '../dtos/tranlogCreate.dto';
import { KTCoinReponse } from '../dtos/ktcoinReponse.dto';

@ApiTags('jxmobi')
@Controller('jxmobi')
export class JxmobiController {
  private readonly logger = new Logger(JxmobiController.name);
  constructor(
    private readonly ktCoinService: KTCoinService,
    private readonly rechangeService: RechangeService,
    private readonly tranLogService: TranlogsService,
  ) {}

  @Get('rechage')
  @ApiResponse({
    type: RechangeReponse,
  })
  rechage(playerData: any): RechangeReponse {
    this.logger.log('rechage', playerData);
    const reponse = new RechangeReponse();
    reponse.Status = 1;
    return reponse;
  }

  @Post('rechage')
  @ApiQuery({
    name: 'playdata',
    type: String,
    allowEmptyValue: true,
    required: false,
  })
  @ApiOkResponse({
    type: String,
    description: 'Trả về thông tin số kcoin hiện có',
  })
  async rechagePost(
    @Query('playdata')
    rechageRequest: string,
  ) {
    const rechageRequestDto = JSON.parse(
      rechageRequest,
    ) as unknown as IRechangeRequest;
    const ktCoinReponse = new KTCoinReponse();

    try {
      const ktcoinEntity = await this.ktCoinService.findOne(
        rechageRequestDto.UserID,
      );
      const checkKTCoin = await this.ktCoinService.available(
        rechageRequestDto.UserID,
        rechageRequestDto.Value,
      );

      ktCoinReponse.Value = ktcoinEntity?.KCoin || 0;

      if (checkKTCoin) {
        ktCoinReponse.Status = 1;
        ktCoinReponse.Msg = 'Tài khoản có đủ ktcoin';
      }

      const converted = JSON.stringify(ktCoinReponse);
      if (!checkKTCoin) {
        return converted;
      }

      //#region  xử lý tạo nhân vật mua knb
      if (rechageRequestDto.Type == 2) {
        this.logger.log(
          `Xử lý mua knb từ trong game, id nhân vật: ${rechageRequestDto.RoleID},  nhân vật: ${rechageRequestDto.RoleName} , ktcoin: ${rechageRequestDto.Value}`,
        );

        //cập nhật ktcoin
        const updateKtCoin = new KTCoinUpdateDto();
        updateKtCoin.NewKCoin = -rechageRequestDto.Value;
        updateKtCoin.UserID = rechageRequestDto.UserID;
        await this.ktCoinService.updateKCoin(updateKtCoin);

        // tạo yêu lệnh mua knb
        const rechageDto = new RechangeCreateDto(rechageRequestDto);
        await this.rechangeService.add(rechageDto);
        // thêm logs nhân vật mua knb
        const tranlogCreateDto = new TranlogsCreateDto(rechageRequestDto);
        this.tranLogService.add(tranlogCreateDto);
      }
      //#endregion

      return converted;
    } catch (ex: unknown) {
      throw new HttpException(
        'Có lỗi từ hệ thống.',
        HttpStatus.SERVICE_UNAVAILABLE,
      );
    }
  }

  @Post('ktcoin')
  @ApiOkResponse({
    status: HttpStatus.CREATED,
  })
  async ktcoinPost(@Body() ktcoinCreate: KTCoinCreateDto) {
    try {
      const isExist = await this.ktCoinService.exist(ktcoinCreate.UserID);
      if (isExist) {
        return new HttpException(
          'Tài khoản đã có trong bảng ktcoin',
          HttpStatus.BAD_REQUEST,
        );
      }
      const ktcoin = await this.ktCoinService.add(ktcoinCreate);
      return ktcoin;
    } catch (ex: unknown) {
      const error = ex as QueryFailedError;
      this.logger.error(`[ktcoinPost] ${error.message}`);
      throw new HttpException('Có lỗi hệ thống', HttpStatus.BAD_REQUEST);
    }
  }

  @Put('ktcoin')
  @ApiOkResponse({
    status: HttpStatus.OK,
    description: 'Cập nhật ktcoin thành công',
  })
  @ApiResponse({
    status: HttpStatus.SERVICE_UNAVAILABLE,
    description: 'Lỗi hệ thông',
  })
  async ktcoinPut(@Body() ktcoinUpdate: KTCoinUpdateDto) {
    try {
      await this.ktCoinService.updateKCoin(ktcoinUpdate);
      this.logger.log(
        `Tài khoản ${ktcoinUpdate.UserID} cập nhật ${ktcoinUpdate.NewKCoin} ktcoin.`,
      );
      return new HttpException('Cập nhật kcoin thành công.', HttpStatus.OK);
    } catch (ex: unknown) {
      throw new HttpException(
        'Có lỗi từ hệ thống.',
        HttpStatus.SERVICE_UNAVAILABLE,
      );
    }
  }
}

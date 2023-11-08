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

@ApiTags('jxmobi')
@Controller('jxmobi')
export class JxmobiController {
  private readonly logger = new Logger(JxmobiController.name);
  constructor(
    private readonly ktCoinService: KTCoinService,
    private readonly rechangeService: RechangeService,
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
  rechagePost(
    @Query('playdata')
    rechageRequest: string,
  ) {
    if (!rechageRequest) {
      rechageRequest = JSON.stringify({
        Value: 10000,
        Type: 2,
        UserID: 111,
        RoleID: 3434,
        RoleName: '232323',
        SeverID: 1,
      });
    }

    const rechageRequestDto = JSON.parse(
      rechageRequest,
    ) as unknown as IRechangeRequest;

    const rechageDto = new RechangeCreateDto(rechageRequestDto);

    this.rechangeService.add(rechageDto);
    const reponse = { Status: 1, Value: 10000, Msg: 'xin chao' };
    const converted = JSON.stringify(reponse);
    return converted;
  }

  @Post('ktcoin')
  @ApiOkResponse({
    status: HttpStatus.CREATED,
  })
  async ktcoinPost(@Body() ktcoinCreate: KTCoinCreateDto) {
    try {
      const isExist = await this.ktCoinService.exist(ktcoinCreate.UserName);
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
        `Tài khoản ${ktcoinUpdate.UserName} cập nhật ${ktcoinUpdate.NewKCoin} ktcoin.`,
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

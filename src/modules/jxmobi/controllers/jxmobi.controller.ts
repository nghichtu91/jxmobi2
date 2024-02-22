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
import {
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { RechangeReponse } from '../dtos/rechange.dto';
import { KTCoinCreateDto } from '../dtos/ktcoinCreate.dto';
import { KTCoinService } from '../services/ktcoin.service';
import { QueryFailedError } from 'typeorm';
import { KTCoinUpdateDto } from '../dtos/ktcoinUpdate.dto';
import { RechangeService } from '../services/rechange.service';
import { IRechangeRequest } from '../dtos/rechageRequest.dto';
import { TranlogsService } from '../services/tranlogs.service';
import { KTCoinReponse } from '../dtos/ktcoinReponse.dto';
import { IGiftcodeRequest } from '../dtos/giftcode/giftcodeRequest.dto';
import { GiftcodeResponse } from '../dtos/giftcode/giftcodeResponse.dto';
import { GiftCodeService } from '../services/giftcode.service';
import { GiftcodelogsService } from '../services/giftcodelogs.service';
import { GiftCodeLogCreateDto } from '../dtos/giftcode/giftcodelogcreate.dto';
import { ServergameRepDto } from '../dtos/servergames/servergameRespon.dto';
import { ServergameDto } from '../dtos/servergames/servergame.dto';
import { AuthenReponDto } from '../dtos/authen/autheRepon.dto';
import { UserService } from '@/modules/user/services';
import { RegDTO } from '../dtos/authen/reg.dto';
import { RegReponDto } from '../dtos/authen/regRepon.dto';
import { CreateUserDTO } from '@/modules/user/dtos';

@ApiTags('jxmobi')
@Controller('jxmobi')
export class JxmobiController {
  private readonly logger = new Logger(JxmobiController.name);
  constructor(
    // private readonly ktCoinService: KTCoinService,
    // private readonly rechangeService: RechangeService,
    // private readonly tranLogService: TranlogsService,
    // private readonly giftCodeService: GiftCodeService,
    // private readonly giftcodelogsService: GiftcodelogsService,
    private readonly userService: UserService,

  ) { }

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

  // @Post('rechage')
  // @ApiQuery({
  //   name: 'playdata',
  //   type: String,
  //   allowEmptyValue: true,
  //   required: false,
  // })
  // @ApiOkResponse({
  //   type: String,
  //   description: 'Trả về thông tin số kcoin hiện có',
  // })
  // @ApiOperation({ summary: 'kiểm tra ktcoin cho game server' })
  // async rechagePost(
  //   @Query('playdata')
  //   rechageRequest: string,
  // ) {
  //   const rechageRequestDto = JSON.parse(
  //     rechageRequest,
  //   ) as unknown as IRechangeRequest;
  //   const ktCoinReponse = new KTCoinReponse();

  //   try {
  //     const ktcoinEntity = await this.ktCoinService.findOne(
  //       rechageRequestDto.UserID,
  //     );
  //     const checkKTCoin = await this.ktCoinService.available(
  //       rechageRequestDto.UserID,
  //       rechageRequestDto.Value,
  //     );

  //     ktCoinReponse.Value = ktcoinEntity?.KCoin || 0;

  //     if (checkKTCoin) {
  //       ktCoinReponse.Status = 1;
  //       ktCoinReponse.Msg = 'Tài khoản có đủ ktcoin';
  //     }

  //     const converted = JSON.stringify(ktCoinReponse);
  //     if (!checkKTCoin) {
  //       return converted;
  //     }


  //     if (rechageRequestDto.Type == 2) {
  //       this.logger.log(
  //         `Xử lý mua knb từ trong game, id nhân vật: ${rechageRequestDto.RoleID},  nhân vật: ${rechageRequestDto.RoleName} , ktcoin: ${rechageRequestDto.Value}`,
  //       );


  //       const updateKtCoin = new KTCoinUpdateDto();
  //       updateKtCoin.NewKCoin = -rechageRequestDto.Value;
  //       updateKtCoin.UserID = rechageRequestDto.UserID;
  //       await this.ktCoinService.updateKCoin(updateKtCoin);
  //     }


  //     return converted;
  //   } catch (ex: unknown) {
  //     throw new HttpException(
  //       'Có lỗi từ hệ thống.',
  //       HttpStatus.SERVICE_UNAVAILABLE,
  //     );
  //   }
  // }

  // @Post('ktcoin')
  // @ApiOkResponse({
  //   status: HttpStatus.CREATED,
  // })
  // async ktcoinPost(@Body() ktcoinCreate: KTCoinCreateDto) {
  //   try {
  //     const isExist = await this.ktCoinService.exist(ktcoinCreate.UserID);
  //     if (isExist) {
  //       return new HttpException(
  //         'Tài khoản đã có trong bảng ktcoin',
  //         HttpStatus.BAD_REQUEST,
  //       );
  //     }
  //     const ktcoin = await this.ktCoinService.add(ktcoinCreate);
  //     return ktcoin;
  //   } catch (ex: unknown) {
  //     const error = ex as QueryFailedError;
  //     this.logger.error(`[ktcoinPost] ${error.message}`);
  //     throw new HttpException('Có lỗi hệ thống', HttpStatus.BAD_REQUEST);
  //   }
  // }

  // @Put('ktcoin')
  // @ApiOkResponse({
  //   status: HttpStatus.OK,
  //   description: 'Cập nhật ktcoin thành công',
  // })
  // @ApiResponse({
  //   status: HttpStatus.SERVICE_UNAVAILABLE,
  //   description: 'Lỗi hệ thông',
  // })
  // async ktcoinPut(@Body() ktcoinUpdate: KTCoinUpdateDto) {
  //   try {
  //     await this.ktCoinService.updateKCoin(ktcoinUpdate);
  //     this.logger.log(
  //       `Tài khoản ${ktcoinUpdate.UserID} cập nhật ${ktcoinUpdate.NewKCoin} ktcoin.`,
  //     );
  //     return new HttpException('Cập nhật kcoin thành công.', HttpStatus.OK);
  //   } catch (ex: unknown) {
  //     throw new HttpException(
  //       'Có lỗi từ hệ thống.',
  //       HttpStatus.SERVICE_UNAVAILABLE,
  //     );
  //   }
  // }

  // @Post('giftcode')
  // @ApiQuery({
  //   name: 'playdata',
  //   type: String,
  //   allowEmptyValue: true,
  //   required: false,
  // })
  // @ApiOkResponse({
  //   type: String,
  //   description: 'Trả về thông tin giftcode',
  // })
  // @ApiOperation({ summary: 'kiểm tra giftcode cho game server' })
  // async useGiftCodePost(
  //   @Query('playdata')
  //   giftCodeRequest: string,
  // ) {
  //   const { CodeActive, ServerID, RoleActive } = JSON.parse(
  //     giftCodeRequest,
  //   ) as unknown as IGiftcodeRequest;

  //   const giftcodeReponse = new GiftcodeResponse();

  //   try {
  //     const isUsed = await this.giftcodelogsService.isEist(
  //       CodeActive,
  //       RoleActive,
  //       ServerID,
  //     );

  //     if (isUsed) {
  //       giftcodeReponse.Status = -2;
  //       giftcodeReponse.Msg = 'Bạn đã sử dụng.';
  //       return JSON.stringify(giftcodeReponse);
  //     }

  //     const giftcode = await this.giftCodeService.use(CodeActive);

  //     if (giftcode) {
  //       giftcodeReponse.Status = 1;
  //       giftcodeReponse.GiftItem = giftcode.ItemList;
  //       const giftcodeLogCreate = new GiftCodeLogCreateDto({
  //         CodeActive,
  //         ServerID,
  //         RoleActive,
  //       });
  //       this.giftcodelogsService.create(giftcodeLogCreate);
  //       this.logger.log(
  //         `[GiftCode] ${RoleActive} sử dụng gift code ${CodeActive}.`,
  //       );
  //     }

  //     return JSON.stringify(giftcodeReponse);
  //   } catch (ex: unknown) {
  //     throw new HttpException(
  //       'Có lỗi từ hệ thống.',
  //       HttpStatus.SERVICE_UNAVAILABLE,
  //     );
  //   }
  // }

  @Get('serverlist')
  getserverlist() {
    const serverRecomment = new ServergameDto();
    serverRecomment.nServerID = 1;
    serverRecomment.nServerPort = 3001;
    serverRecomment.nStatus = 4;
    serverRecomment.strServerName = 'Thử nghiệm 1';
    serverRecomment.strStartTime = new Date().toDateString();
    serverRecomment.strURL = '103.14.48.14';

    const reponseServers = new ServergameRepDto();
    reponseServers.RecommendListServerData = [serverRecomment];
    reponseServers.ListServerData = [serverRecomment];
    return reponseServers;
  }

  @ApiBody({ type: RegDTO })
  @ApiOkResponse({
    type: RegReponDto
  })
  @Post('reguser')
  async regAccount(@Body() data: RegDTO) {
    const userIsExist = await this.userService.userNameIsExist(data.username);
    if (userIsExist) {
      return new RegReponDto(-1, 'Tài khoản đã được sử dụng!');
    }
    const createDto = new CreateUserDTO();
    createDto.userName = data.username;
    createDto.passWord = data.password;
    await this.userService.create(createDto);
    return new RegReponDto(1, 'Đăng ký tài khoản thành công.');
  }

  @Post('logingame')
  @ApiBody({ type: RegDTO })
  @ApiOkResponse({
    type: AuthenReponDto,
  })
  async loginGame(@Body() { username, password }: RegDTO) {
    
    const gh = await this.userService.findByUserName(username);
    if(!gh || !gh.comparePassword(password)) {
      const reponse = new AuthenReponDto('', '');
      reponse.ErrorCode = -1;
      return reponse;
    }
    return new AuthenReponDto(username, username);
  }
}

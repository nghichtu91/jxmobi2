import { Body, Controller, Get, Logger, Post } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { IRechangeRequest, RechangeReponse } from '../dtos/rechange.dto';

@ApiTags('jxmobi')
@Controller('jxmobi')
export class JxmobiController {
  private readonly logger = new Logger(JxmobiController.name);

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
  @ApiResponse({
    type: RechangeReponse,
  })
  rechagePost(@Body() playerData: IRechangeRequest): RechangeReponse {
    this.logger.log('rechage', playerData);
    const reponse = new RechangeReponse();
    reponse.Status = 1;
    reponse.Value = 10000;
    reponse.Msg = 'xin chao';
    return reponse;
  }
}

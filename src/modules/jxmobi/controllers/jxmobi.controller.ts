import { Query, Controller, Get, Logger, Post } from '@nestjs/common';
import { ApiOkResponse, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
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
  @ApiQuery({
    name: 'playdata',
    type: String,
  })
  @ApiOkResponse({
    type: String,
    description: 'Trả về thông tin số kcoin hiện có',
  })
  rechagePost(@Query('playdata') playdata: string) {
    this.logger.log('rechage', playdata);
    const reponse = { Status: 1, Value: 10000, Msg: 'xin chao' };
    const converted = JSON.stringify(reponse);
    return converted;
  }
}

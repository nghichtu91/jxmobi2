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

 toBytes = (text: string): number[] => {
    const buffer = Buffer.from(text, 'utf8');
    const result = Array(buffer.length);
    for (let i = 0; i < buffer.length; ++i) {
        result[i] = buffer[i];
    }
    return result;
};
  @Post('rechage')
  @ApiResponse({
    type: RechangeReponse,
  })
  rechagePost(@Body() playerData: IRechangeRequest) {
    this.logger.log('rechage', playerData);
    const reponse = { Status: 1, Value: 10000, Msg: 'xin chao' };
    const converted = JSON.stringify(reponse);
    return this.toBytes(converted);
  }
}

import { Controller, Get } from '@nestjs/common';
import { ApiExcludeController } from '@nestjs/swagger';

@Controller()
@ApiExcludeController()
export class AppController {
  @Get()
  async dashboardRender() {
    return {
      layout: false,
      title: 'Dashbord page',
    };
  }
}

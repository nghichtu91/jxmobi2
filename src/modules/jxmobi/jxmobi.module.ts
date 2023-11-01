import { Module } from '@nestjs/common';
import { JxmobiController } from './controllers';

@Module({
  imports: [],
  controllers: [JxmobiController],
})
export class JxMobiModule {}

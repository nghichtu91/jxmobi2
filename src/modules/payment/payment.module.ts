import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentController } from './controllers/payment.controler';
import { PaymentEntity } from './entities';
import { PaymentService } from './services';
// import { PaymentSubscriber } from './subscribers';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([PaymentEntity])],
  providers: [PaymentService],
  controllers: [PaymentController],
  exports: [PaymentService],
})
export class PaymentModule {}

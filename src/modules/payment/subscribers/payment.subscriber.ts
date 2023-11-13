import { Logger } from '@nestjs/common';

import {
  DataSource,
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
  UpdateEvent,
} from 'typeorm';

import { PaymentEntity } from '../entities/payment.entity';
import { TelegramService } from 'nestjs-telegram';

@EventSubscriber()
export class PaymentSubscriber
  implements EntitySubscriberInterface<PaymentEntity>
{
  private readonly logger: Logger = new Logger(PaymentSubscriber.name);
  constructor(
    dataSource: DataSource,
    private readonly telegramSevice: TelegramService,
  ) {
    dataSource.subscribers.push(this);
  }
  listenTo(): typeof PaymentEntity {
    return PaymentEntity;
  }

  beforeInsert(event: InsertEvent<PaymentEntity>): void {
    this.logger.log(`BEFORE PAYMENT INSERTED ${JSON.stringify(event.entity)}`);
  }

  afterInsert(event: InsertEvent<PaymentEntity>): void {}

  afterUpdate(event: UpdateEvent<PaymentEntity>): void {}
}

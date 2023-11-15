import {
  BaseEntity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryColumn,
  Entity,
  PrimaryGeneratedColumn,
  BeforeInsert,
  BeforeUpdate,
} from 'typeorm';
import { IPaymentModel } from '../dtos';
import { IBaseModel } from '@shared';
import { CardTypes } from '@config';

@Entity({ name: 'payment_card_log' })
export class PaymentEntity
  extends BaseEntity
  implements IBaseModel<IPaymentModel>
{
  @PrimaryGeneratedColumn('increment')
  @PrimaryColumn({ name: 'ID', type: 'int' })
  id: number;

  @Column({ name: 'username', type: 'varchar', length: 32 })
  userName: string;

  @Column({ name: 'coin', type: 'bigint' })
  coin: number;

  @Column({ name: 'type', type: 'varchar' })
  cardType?: CardTypes;

  @Column({ name: 'cardseri', type: 'varchar' })
  cardSeri?: string;

  @Column({ name: 'cardvalue', type: 'bigint', nullable: false })
  cardValue?: number;

  @Column({ name: 'cardpin', type: 'varchar' })
  cardPin?: string;

  @Column({ type: 'nvarchar', name: 'content' })
  comment?: string;

  @Column({ type: 'nvarchar', name: 'method' })
  method?: string;
  @Column({ type: 'nvarchar', name: 'transactionId' })
  transactionId?: string;
  @Column({ type: 'nvarchar', name: 'action' })
  action?: string;

  @Column({ type: 'int', name: 'status', nullable: false })
  status = 0;

  @CreateDateColumn({ type: 'datetime' })
  createdAt?: Date;
  @UpdateDateColumn({ type: 'datetime' })
  updatedAt?: Date;

  @BeforeInsert()
  private createTime(): void {
    this.createdAt = new Date();
  }

  @BeforeUpdate()
  private updateTime(): void {
    this.updatedAt = new Date();
  }
}

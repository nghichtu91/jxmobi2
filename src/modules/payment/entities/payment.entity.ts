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
  @PrimaryColumn({ name: 'id', type: 'int' })
  id?: string;

  @Column({ name: 'username', type: 'varchar', length: 32 })
  userName: string;

  @Column({ name: 'coin', type: 'bigint' })
  coin: number;

  @Column({ name: 'gateway_api', type: 'varchar' })
  gateway?: string;

  @Column({ name: 'cardtype', type: 'varchar' })
  cardType?: CardTypes;

  @Column({ name: 'cardseri', type: 'varchar' })
  cardSeri?: string;
  @Column({ name: 'cardvalue', type: 'float', nullable: false })
  cardValue?: number;
  @Column({ name: 'cardpin', type: 'varchar' })
  cardPin?: string;

  @Column({ name: 'transaction_status', type: 'varchar' })
  transaction?: string;
  @Column({ name: 'transaction_id', type: 'varchar' })
  transactionId?: string;
  @Column({ name: 'transaction_code', type: 'char' })
  transactionCode?: string;

  @Column({ type: 'nvarchar', name: 'content' })
  comment?: string;

  @Column({ type: 'int', name: 'status', nullable: false })
  status = 0;

  @CreateDateColumn({ name: 'createtime', type: 'datetime' })
  createdAt?: Date;
  @UpdateDateColumn({ name: 'verifytime', type: 'datetime' })
  updatedAt?: Date;

  @BeforeInsert()
  createTime(): void {
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  @BeforeUpdate()
  updateTime(): void {
    this.updatedAt = new Date();
  }
}

import {
  BaseEntity,
  Column,
  PrimaryColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { IBaseModel } from '@shared';
import { IKTCoin } from '@Modules/jxmobi/dtos';

@Entity({ name: 'KTCoins' })
export class KTCoinEntity extends BaseEntity implements IBaseModel<IKTCoin> {
  @PrimaryGeneratedColumn('increment')
  @PrimaryColumn({
    type: 'int',
  })
  ID: number;

  @Column({
    name: 'UserID',
    type: 'int',
    nullable: true,
  })
  UserID: number;

  @Column({
    name: 'KCoin',
    type: 'int',
    default: 0,
    nullable: true,
  })
  KCoin: number;

  @UpdateDateColumn({
    name: 'UpdateTime',
    type: 'datetime',
    nullable: true,
  })
  UpadateTime?: Date;

  @Column({
    type: 'varchar',
    nullable: true,
    name: 'UserName',
    length: 50,
  })
  UserName?: string;
}

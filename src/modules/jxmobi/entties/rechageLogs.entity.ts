import {
  BaseEntity,
  Column,
  PrimaryColumn,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';
import { IBaseModel } from '@shared';
import { IRechageLogs } from '@Modules/jxmobi/dtos';

@Entity({ name: 'RechageLogs' })
export class RechageLogsEntity
  extends BaseEntity
  implements IBaseModel<IRechageLogs>
{
  @PrimaryGeneratedColumn('increment')
  @PrimaryColumn({
    type: 'int',
    name: 'ID',
  })
  ID: number;
  @Column({
    type: 'int',
    name: 'UserID',
    nullable: true,
  })
  UserID: number;
  @Column({
    type: 'int',
    name: 'CoinValue',
    nullable: true,
  })
  CoinValue: number;
  @Column({
    type: 'int',
    name: 'BeforeCoin',
    nullable: true,
  })
  BeforeCoin: number;
  @Column({
    type: 'int',
    name: 'AfterCoin',
    nullable: true,
  })
  AfterCoin: number;
  @Column({
    type: 'nvarchar',
    name: 'RechageType',
    nullable: true,
    length: 50,
  })
  RechageType: string;
  @Column({
    type: 'nvarchar',
    name: 'Pram_0',
    nullable: true,
    length: 50,
  })
  Pram_0: string;
  @Column({
    type: 'nvarchar',
    name: 'Pram_1',
    nullable: true,
    length: 50,
  })
  Pram_1: string;
  @Column({
    type: 'nvarchar',
    name: 'Pram_2',
    nullable: true,
    length: 50,
  })
  Pram_2: string;
  @Column({
    type: 'int',
    name: 'Pram_2',
    nullable: true,
  })
  Pram_3: number;
  @Column({
    type: 'nvarchar',
    name: 'Messenger',
    nullable: true,
    length: 100,
  })
  Messenger: string;
  @Column({
    type: 'int',
    name: 'Status',
    nullable: true,
  })
  Status: number;
  @Column({
    type: 'nvarchar',
    name: 'TransID',
    nullable: true,
    length: 50,
  })
  TransID: string;
  @Column({
    type: 'int',
    name: 'ValueRechage',
    nullable: true,
  })
  ValueRechage: number;
  @Column({
    type: 'nvarchar',
    name: 'ActionBy',
    nullable: true,
  })
  ActionBy: string;
  @CreateDateColumn({
    name: 'RechageDate',
    type: 'datetime',
  })
  RechageDate: Date;
}

import { IBaseModel } from '@shared';
import {
  BaseEntity,
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { IGiftCodeModel } from '../dtos/giftcode/giftcode.model';

@Entity({ name: 'GiftCodes' })
export class GiftCodeEntity
  extends BaseEntity
  implements IBaseModel<IGiftCodeModel>
{
  @PrimaryColumn()
  @PrimaryGeneratedColumn('increment')
  ID: number;

  @Column({ type: 'int' })
  ServerID: number;

  @Column({ type: 'varchar', nullable: true })
  Code: string;

  @Column({ type: 'int' })
  Status: number;

  @Column({ type: 'nvarchar', nullable: true })
  ItemList: string;

  @CreateDateColumn({ name: 'TimeCreate', type: 'datetime' })
  TimeCreate: Date;

  @Column({ type: 'nvarchar', nullable: true })
  CodeType: string;

  @Column({ type: 'int' })
  MaxActive: number;

  @Column({ type: 'nvarchar', nullable: true })
  UserName: string;

  @BeforeInsert()
  create() {
    this.TimeCreate = new Date();
  }
}

import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { IGiftcodelogModel } from '../dtos/giftcode/giftcodelog.model';
import { IBaseModel } from '@shared';

@Entity({ name: 'GiftCodeLogs' })
export class GiftcodelogsEntity
  extends BaseEntity
  implements IBaseModel<IGiftcodelogModel>
{
  @PrimaryColumn()
  @PrimaryGeneratedColumn('increment')
  ID: number;

  @Column({ type: 'nvarchar', nullable: true })
  Code: string;

  @Column({ type: 'int', nullable: true })
  ActiveRole: number;

  @CreateDateColumn({ type: 'datetime' })
  ActiveTime: Date;

  @Column({ type: 'nvarchar', nullable: true })
  CodeType: string;

  @Column({ type: 'int', nullable: true })
  ServerID: number;
}

import { IBaseModel } from '@shared';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ITranlogs } from '../dtos/tranLogs.model';

@Entity({ name: 'LogsTrans' })
export class TranLogs extends BaseEntity implements IBaseModel<ITranlogs> {
  @PrimaryGeneratedColumn('increment')
  @PrimaryColumn()
  ID: number;

  @Column({
    name: 'UserID',
    type: 'int',
  })
  UserID: number;

  @Column({
    name: 'RoleID',
    type: 'int',
  })
  RoleID: number;

  @Column({
    name: 'RoleName',
    type: 'nvarchar',
  })
  RoleName: string;

  @Column({
    name: 'ServerID',
    type: 'int',
  })
  ServerID: number;

  @Column({
    name: 'Value',
    type: 'int',
  })
  Value: number;

  @CreateDateColumn({
    name: 'TimeTrans',
    type: 'datetime',
  })
  TimeTrans: Date;
}

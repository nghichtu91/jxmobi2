import { SmsActions, SmsExpired } from '@config';
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
import { ISmsDTO } from '../dto/sms.dto';
import ShortUniqueId from 'short-unique-id';
import dayjs from 'dayjs';
import setTZ from 'set-tz';
setTZ('Asia/Bangkok');

@Entity({ name: 'SMS' })
export class SmsEntity extends BaseEntity implements IBaseModel<ISmsDTO> {
  @Column({ name: 'acc', type: 'varchar' })
  userName: string;

  @Column({ name: 'KeyXuLy', type: 'varchar' })
  action: SmsActions;

  @CreateDateColumn({ name: 'time', type: 'datetime' })
  time: Date;

  @Column({ name: 'status', type: 'tinyint' })
  status: number;

  @PrimaryGeneratedColumn('increment')
  @PrimaryColumn({ name: 'id', type: 'int' })
  id: number;

  @Column({ name: 'Code', type: 'varchar' })
  code: string;

  @Column({ name: 'dulieu1', type: 'varchar', length: 50 })
  info1?: string;
  @Column({ name: 'dulieu2', type: 'varchar', length: 50 })
  info2?: string;
  @Column({ name: 'dulieu3', type: 'varchar', length: 50 })
  info3?: string;
  @Column({ name: 'dulieu4', type: 'varchar', length: 50 })
  info4?: string;
  @Column({ name: 'dulieu5', type: 'varchar', length: 50 })
  info5?: string;

  @BeforeInsert()
  createTime() {
    this.time = new Date();
    const uid = new ShortUniqueId();
    this.code = uid();
    this.status = 0;
  }

  validTime() {
    const expried = SmsExpired as number;
    return dayjs().diff(this.time, 'minute') <= expried;
  }
}

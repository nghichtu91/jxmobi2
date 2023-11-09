import { createHash } from 'node:crypto';
import {
  BaseEntity,
  Column,
  BeforeInsert,
  BeforeUpdate,
  PrimaryColumn,
  Entity,
  PrimaryGeneratedColumn,
  JoinColumn,
  OneToOne,
} from 'typeorm';
import { IUserModel } from '../dtos';
import { IBaseModel } from '@shared';
import { KTCoinEntity } from '@modules/jxmobi/entties/ktcoin.entity';

@Entity({ name: 'LoginTables' })
export class UserEntity extends BaseEntity implements IBaseModel<IUserModel> {
  @PrimaryGeneratedColumn('increment')
  @PrimaryColumn({ name: 'ID', type: 'int' })
  ID: number;

  @Column({
    type: 'varchar',
    name: 'LoginName',
  })
  LoginName: string;

  @Column({
    type: 'varchar',
    name: 'Password',
  })
  Password: string;

  @Column({
    type: 'varchar',
    name: 'Phone',
  })
  Phone?: string;

  @Column({
    type: 'int',
    name: 'Status',
  })
  Status?: number;

  @Column({
    type: 'nvarchar',
    name: 'FullName',
  })
  FullName?: string;

  @Column({
    type: 'varchar',
    name: 'Email',
  })
  Email?: string;

  @Column({
    type: 'datetime',
    name: 'TokenTimeExp',
  })
  TokenTimeExp?: Date;

  @Column({
    type: 'varchar',
    name: 'AccessToken',
  })
  AccessToken?: string;

  @Column({
    type: 'varchar',
    name: 'Note',
  })
  Note?: string;

  @Column({
    type: 'int',
    name: 'LastServerLogin',
  })
  LastServerLogin?: number;

  @Column({
    type: 'datetime',
    name: 'LastLoginTime',
  })
  LastLoginTime?: Date;

  @OneToOne(() => KTCoinEntity)
  @JoinColumn([{ name: 'ID', referencedColumnName: 'UserID' }])
  KtCoin?: KTCoinEntity;

  @BeforeInsert()
  @BeforeUpdate()
  hashPassword(): void {
    if (this.Password) {
      this.Password = createHash('md5')
        .update(this.Password)
        .digest('hex')
        .toString()
        .toLocaleUpperCase();
    }
  }

  comparePassword(attempt: string): boolean {
    return (
      createHash('md5')
        .update(attempt)
        .digest('hex')
        .toString()
        .toLocaleUpperCase() === this.Password
    );
  }
}

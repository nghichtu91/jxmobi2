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
  CreateDateColumn,
} from 'typeorm';
import { IUserModel } from '../dtos';
import { IBaseModel } from '@/shared';
import { KTCoinEntity } from '@modules/jxmobi/entties/ktcoin.entity';

@Entity({ name: 'accounts' })
export class UserEntity extends BaseEntity implements IBaseModel<IUserModel> {
  @PrimaryGeneratedColumn('increment')
  @PrimaryColumn({ name: 'ID', type: 'int' })
  ID: number;

  @Column({
    type: 'varchar',
    name: 'username',
  })
  LoginName: string;

  @Column({
    type: 'varchar',
    name: 'password',
  })
  Password: string;

  @Column({
    type: 'varchar',
    name: 'phone',
  })
  Phone?: string;
  Status?: number;
  FullName?: string;

  @Column({
    type: 'varchar',
    name: 'email',
  })
  Email?: string;

  @CreateDateColumn({
    name: 'createAt'
  })
  createAt?: Date;

  @OneToOne(() => KTCoinEntity, (kt) => kt.UserID)
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

  @BeforeInsert() 
  dataCreate(): void {
    this.createAt = new Date();
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

import { createHash } from 'node:crypto';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  BeforeInsert,
  BeforeUpdate,
  PrimaryColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { IUpdateUserDTO, IUserModel } from '../dtos';
import { IBaseModel } from '@shared';
import { ForgotPassworDTO } from '@modules/auth/dtos';

@Entity({ name: 'Account_info' })
export class UserEntity extends BaseEntity implements IBaseModel<IUserModel> {
  @PrimaryGeneratedColumn('increment')
  @PrimaryColumn({ name: 'iid', type: 'bigint' })
  id: string;

  @Column({
    type: 'varchar',
    name: 'cAccName',
  })
  userName: string;

  @Column({
    type: 'varchar',
    name: 'cEMail',
    length: 250,
    nullable: true,
  })
  email: string;

  @Column({
    type: 'varchar',
    name: 'cPhone',
    length: 50,
    nullable: true,
  })
  phone?: string;

  @Column({
    name: 'cPassWord',
    length: 32,
    type: 'varchar',
  })
  passWord: string;

  @BeforeInsert()
  @BeforeUpdate()
  hashPassword(): void {
    if (this.passWord) {
      this.passwordNoEncrypt = this.passWord;
      this.passWord = createHash('md5')
        .update(this.passWord)
        .digest('hex')
        .toString()
        .toLocaleUpperCase();
    }
  }

  @Column({
    name: 'cSecPassWord',
    type: 'varchar',
  })
  passWordSecond: string;

  @Column({ name: 'iClientID', type: 'bigint', insert: false })
  iClientID?: number;

  @CreateDateColumn({
    name: 'dRegDate',
    nullable: true,
    type: 'datetime',
  })
  createdAt?: Date;

  @Column({
    name: 'cPasswordNoEncrypt',
    length: 50,
    type: 'varchar',
  })
  passwordNoEncrypt?: string;

  @Column({
    name: 'cSecPasswordNoEncrypt',
    length: 50,
    type: 'varchar',
  })
  secPasswordNoEncrypt?: string;

  // point
  @Column({
    name: 'nExtPoint',
    type: 'smallint',
  })
  point: number;

  @Column({
    type: 'smallint',
    name: 'nExtPoint1',
    default: 1,
  })
  point1: number;

  @Column({
    type: 'smallint',
    name: 'nExtPoint2',
    default: 0,
  })
  point2: number;

  @Column({
    type: 'smallint',
    name: 'nExtPoint3',
    default: 0,
    select: false,
  })
  point3: number;

  @Column({
    type: 'smallint',
    name: 'nExtPoint4',
    default: 0,
    select: false,
  })
  point4: number;

  @Column({
    type: 'smallint',
    name: 'nExtPoint5',
    default: 0,
    select: false,
  })
  point5: number;

  @Column({
    type: 'smallint',
    name: 'nExtPoint6',
    default: 0,
    select: false,
  })
  point6: number;

  @Column({
    type: 'smallint',
    name: 'nExtPoint7',
    default: 0,
    select: false,
  })
  point7: number;

  @Column({
    type: 'varchar',
    name: 'cQuestion',
    default: 0,
  })
  question?: string;
  @Column({
    type: 'varchar',
    name: 'cAnswer',
    default: 0,
  })
  answer?: string;

  @Column({
    type: 'nchar',
    name: 'cUpdateInfo',
  })
  updateInfo?: string;

  @Column({ type: 'varchar', name: 'cIpAddress' })
  ip?: string;

  @BeforeInsert()
  createTime(): void {
    this.createdAt = new Date();
  }

  @BeforeUpdate()
  beforeUpdateInfo(): void {
    if (this.passWordSecond && this.question) {
      this.updateInfo = '1';
    }
  }

  @BeforeUpdate()
  hashPasswordSecond(): void {
    if (this.passWordSecond) {
      this.secPasswordNoEncrypt = this.passWordSecond;
      this.passWordSecond = createHash('md5')
        .update(this.passWordSecond)
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
        .toLocaleUpperCase() === this.passWord
    );
  }

  @BeforeInsert()
  defaultValues(): void {
    this.point = 1;
    this.point1 = 0;
    this.point2 = 0;
    this.point3 = 0;
    this.point4 = 0;
    this.point5 = 0;
    this.point6 = 0;
    this.point7 = 0;
  }

  /**
   * @param {IUpdateUserDTO} params
   * @returns {boolean}
   */
  beforeChangeCheckInfo(params: IUpdateUserDTO): boolean {
    return (
      this.phone !== params.phone ||
      this.question !== params.question ||
      this.answer !== params.answer ||
      this.secPasswordNoEncrypt !== params.passWordSecond
    );
  }

  beforCheckForgotPassword(params: ForgotPassworDTO) {
    return (
      this.phone !== params.phone ||
      this.question !== params.question ||
      this.answer !== this.answer
    );
  }

  checkEmail(email?: string) {
    if (!this.email || this.email === '0@gmail.com' || this.email === email) {
      return true;
    }
    return false;
  }
}

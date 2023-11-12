import { Injectable, Logger } from '@nestjs/common';
import { UserEntity } from '../entities';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository, UpdateResult, Between } from 'typeorm';
import { CreateUserDTO } from '../dtos/create.dto';
import { ChangePassWordDTO, UpdateUserDTO } from '../dtos';
import { createHash } from 'node:crypto';

interface IUserService {
  getUser(userName: string): Promise<UserEntity>;
}

@Injectable()
export class UserService implements IUserService {
  private loger = new Logger(UserService.name);
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  findByUserName(userName: string) {
    return this.userRepository.findOne({
      where: { LoginName: userName },
    });
  }

  async phoneIsExist(phone: string) {
    const phoneNumber = await this.userRepository.count({
      where: {
        Phone: phone,
      },
    });
    return phoneNumber === 0;
  }

  async userNameIsExist(username: string) {
    const userNameNumber = await this.userRepository.count({
      where: {
        LoginName: username,
      },
    });
    return userNameNumber === 0;
  }

  async create({
    userName,
    passWord,
    phone,
  }: CreateUserDTO): Promise<UserEntity> {
    const userEntity = this.userRepository.create({
      LoginName: userName,
      Password: passWord,
      Phone: phone,
    });
    return this.userRepository.save(userEntity);
  }

  getUser(userName: string): Promise<UserEntity> {
    return this.userRepository.findOne({
      where: {
        LoginName: userName,
      },
    });
  }
  /**
   *
   * @param userName
   * @param data
   * @returns
   */
  update(userName: string, userUpdateDto: UpdateUserDTO) {
    const userEntity = this.userRepository.create(userUpdateDto);
    return this.userRepository.update(
      {
        LoginName: userName,
      },
      userEntity,
    );
  }

  /**
   * @class UserService
   * @author nhatthanh5891
   * @description cập nhật lại mật khẩu của tài khoản.
   * @param {string} userName
   * @param {ChangePassWordDTO} data
   * @returns {Promise<UpdateResult>}
   */
  async changePassword(
    userName: string,
    { newPassWord }: ChangePassWordDTO,
  ): Promise<UpdateResult> {
    const updateEntity = this.userRepository.create({
      Password: newPassWord,
    });
    const updatePassword = this.userRepository.update(
      {
        LoginName: userName,
      },
      updateEntity,
    );
    return updatePassword;
  }

  async getCount(keyword = '', form?: string, to?: string) {
    const where: any = {};
    const orWhere: any = {};
    const gh = this.userRepository.createQueryBuilder();

    if (keyword !== '') {
      where.userName = Like(`%${keyword}%`);
      orWhere.phone = Like(`%${keyword}%`);
    }
    if (form && to) {
      where.createdAt = Between(form, to);
    }
    gh.andWhere(where).orWhere(orWhere);
    // console.log(await gh.getCount());
    return await gh.getCount();

    // this.userRepository.count({
    //   where: where,
    // });
  }

  async getUsers(
    paged = 1,
    pageSize = 12,
    keyword = '',
    form?: string,
    to?: string,
  ): Promise<UserEntity[]> {
    let sqlf = `SELECT ROW_NUMBER() OVER(ORDER BY nExtPoint1 DESC) AS Numero,
    iid as id, cQuestion as question, cEMail as email, cAnswer as answer, cAccName as userName, cPhone as phone, cPasswordNoEncrypt as passwordNoEncrypt, cSecPasswordNoEncrypt as secPasswordNoEncrypt, nExtPoint as point, nExtPoint1 as point1, dRegDate as createdAt, cUpdateInfo as updateInfo FROM Account_Info
    `;
    const params: string[] = [];

    if (keyword != '') {
      params.push('cAccName LIKE @2 or cPhone LIKE @2 ');
    }

    if (form && to) {
      params.push('dRegDate BETWEEN @3 AND @4');
    }

    if (params.length > 0) {
      sqlf = `${sqlf} WHERE ${params.join(' AND ')}`;
    }

    const sql = `SELECT * FROM (${sqlf}) AS TBL
    WHERE Numero BETWEEN ((@0 - 1) * @1 + 1) AND (@0 * @1)
    ORDER BY point1 DESC`;

    const s = await this.userRepository.query(sql, [
      paged,
      pageSize,
      keyword ? `%${keyword}%` : '',
      form,
      to,
    ]);
    return s.map((c: any) => {
      return this.userRepository.create(c);
    });
  }
}

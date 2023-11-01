import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { UserEntity } from '../entities';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository, UpdateResult, Between } from 'typeorm';
import { CreateUserDTO } from '../dtos/create.dto';
import { ChangePassWordDTO, UpdateUserDTO } from '../dtos';
import { createHash } from 'node:crypto';

@Injectable()
export class UserService {
  private loger = new Logger(UserService.name);
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  findByUserName(userName: string) {
    return this.userRepository.find({
      where: { userName: userName },
    });
  }

  async phoneIsExist(phone: string) {
    const phoneNumber = await this.userRepository.count({
      where: {
        phone: phone,
      },
    });
    return phoneNumber === 0;
  }

  async userNameIsExist(username: string) {
    const userNameNumber = await this.userRepository.count({
      where: {
        userName: username,
      },
    });
    return userNameNumber === 0;
  }

  async create(data: CreateUserDTO): Promise<UserEntity> {
    const user = this.userRepository.create(data);
    try {
      const inserted = await this.userRepository.save(user);
      // const playtime = this.playtimeRepository.create({
      //   userName: inserted.userName,
      // });
      // this.playtimeRepository.save(playtime);
      return inserted;
    } catch (err) {
      throw new HttpException(
        `${err.detail}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getUser(userName: string) {
    const users = await this.userRepository.find({
      select: [
        'point1',
        'id',
        'userName',
        'updateInfo',
        'phone',
        'point',
        'iClientID',
        'createdAt',
        'email',
      ],
      where: {
        userName: userName,
      },
    });
    return users[0];
  }
  /**
   *
   * @param userName
   * @param data
   * @returns
   */
  update(userName: string, data: UpdateUserDTO) {
    const userDto = this.userRepository.create(data);
    const ff = this.userRepository.update(
      {
        userName,
      },
      userDto,
    );
    return ff;
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
    data: ChangePassWordDTO,
  ): Promise<UpdateResult> {
    const passwordMd5 = createHash('md5').update(data.passWord).digest('hex');
    const updatePassword = this.userRepository.update(
      {
        userName: userName,
      },
      { passWord: passwordMd5 },
    );
    return updatePassword;
  }

  /**
   *
   * @param {string} userName
   * @param  {number} money
   * @returns
   */
  async addMoney(userName: string, money: number) {
    try {
      this.loger.log(`[addMoney] cộng vào tài khoản ${userName} ${money} xu!`);
      const adding = await this.userRepository.update(
        {
          userName: userName,
        },
        {
          point1: () => `nExtPoint1 + ${money}`,
        },
      );
      return adding;
    } catch (e) {
      this.loger.error('[addMoney] có lỗi cộng xu.');
      throw new Error('Có lỗi cộng xu');
    }
  }

  getCount(keyword = '', form?: string, to?: string) {
    const where: any = {};

    if (keyword !== '') {
      where.userName = Like(`%${keyword}%`);
    }
    if (form && to) {
      where.createdAt = Between(form, to);
    }
    return this.userRepository.count({
      where: where,
    });
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
      params.push('cAccName LIKE @2');
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

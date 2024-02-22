import { Inject, Injectable, Logger } from '@nestjs/common';
import { UserEntity } from '../entities';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Like,
  Repository,
  UpdateResult,
  Between,
  FindOptionsWhere,
} from 'typeorm';
import { CreateUserDTO } from '../dtos/create.dto';
import { ChangePassWordDTO, UpdateUserDTO } from '../dtos';

interface IUserService {
  getUser(userName: string): Promise<UserEntity>;
  total(): Promise<number>;
  findByUserName(userName: string): Promise<UserEntity>;
}

@Injectable()
export class UserService implements IUserService {
  private loger = new Logger(UserService.name);
  constructor(
    // @InjectRepository(UserEntity)
    @Inject('USER_REPOSITORY')
    private userRepository: Repository<UserEntity>,
  ) {}

  total() {
    return this.userRepository.count();
  }

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
    const userNameNumber = await this.userRepository.exist({
      where: {
        LoginName: username,
      },
    });
    return userNameNumber;
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
  ): Promise<[UserEntity[], number]> {
    const limit = Number(pageSize);
    const offset = (Number(paged) - 1) * limit;
    const where: FindOptionsWhere<UserEntity> = {};
    if (keyword) {
      where.LoginName = Like(`%${keyword}%`);
    }
    const users = this.userRepository.findAndCount({
      // select: ['ID', 'FullName', 'LoginName', 'Phone', 'Email'],
      where,
      take: limit,
      skip: offset,
      relations: {
        KtCoin: true,
      },
    });

    return users;
  }
}

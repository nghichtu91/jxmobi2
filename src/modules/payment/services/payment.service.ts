import { CardTypes } from '@/config';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Repository,
  In,
  UpdateResult,
  FindOptionsWhere,
  Between,
  Equal,
} from 'typeorm';
import { ISearchPaymentParams } from '../dtos';
import { ICreatePaymentDto } from '../dtos/createPayment.dto';
import { IPaymentUpdateDTO } from '../dtos/update.dto';
import { PaymentEntity } from '../entities';
import dayjs from 'dayjs';

interface IPaymentService {
  total(filter?: ISearchPaymentParams): Promise<number>;
  add(createDto: ICreatePaymentDto): Promise<PaymentEntity>;
  update(id: number, updateDto: IPaymentUpdateDTO): Promise<UpdateResult>;
  get(id: number): Promise<PaymentEntity>;
  totalMoney(isToday?: boolean): Promise<number>;
  historiesByUserName(
    paged: number,
    filter: ISearchPaymentParams,
  ): Promise<[PaymentEntity[], number]>;
  updateByContent(content: string, status: number): Promise<UpdateResult>;
  getByContent(content: string): Promise<PaymentEntity>;
}

@Injectable()
export class PaymentService implements IPaymentService {
  constructor(
    @InjectRepository(PaymentEntity)
    private paymentRepo: Repository<PaymentEntity>,
  ) {}
  getByContent(content: string): Promise<PaymentEntity> {
    return this.paymentRepo.findOne({
      where: {
        comment: Equal(content),
      },
    });
  }

  updateByContent(content: string, status: number): Promise<UpdateResult> {
    return this.paymentRepo.update(
      {
        comment: Equal(content),
      },
      {
        status: status,
      },
    );
  }

  totalMoney(isToday?: boolean): Promise<number> {
    const where: FindOptionsWhere<PaymentEntity> = {
      status: 1,
    };
    if (isToday) {
      const startDay = dayjs().startOf('date');
      const endDay = dayjs().endOf('date');
      where.createdAt = Between(
        dayjs(startDay.format('YYYY-MM-DDTHH:mm:ss').toString()).toDate(),
        dayjs(endDay.format('YYYY-MM-DDTHH:mm:ss').toString()).toDate(),
      );
    }
    return this.paymentRepo.sum('cardValue', where);
  }

  get(id: number): Promise<PaymentEntity> {
    return this.paymentRepo.findOne({
      where: {
        id: id,
      },
    });
  }

  add(data: ICreatePaymentDto) {
    const creating = this.paymentRepo.create(data);
    return this.paymentRepo.save(creating);
  }

  updateStatus(id: number, status: number, message?: string, action?: string) {
    return this.paymentRepo.update(
      {
        id: id,
      },
      {
        status: status,
        comment: message,
        action: action,
      },
    );
  }

  update(id: number, updateDto: IPaymentUpdateDTO) {
    const updateEntity = this.paymentRepo.create(updateDto);
    return this.paymentRepo.update(
      {
        id,
      },
      updateEntity,
    );
  }

  async getTotalByUserName(userName: string) {
    return await this.paymentRepo.count({
      where: {
        userName: userName,
        cardType: In([
          CardTypes.MOBIFONE,
          CardTypes.VIETTEL,
          CardTypes.VINAPHONE,
        ]),
      },
    });
  }

  async staticByYear(year: number) {
    const sql = `SELECT DATEPART(Month, verifytime) label, SUM(cardvalue) as value FROM payment_card_log 
    where ([status] = 1 OR [status] = 2) AND YEAR([verifytime]) = @0
    GROUP BY DATEPART(Month, verifytime) ORDER BY label`;
    const t = await this.paymentRepo.query(sql, [year]);
    return t;
  }

  async staticByFormTo(form: string, to: string) {
    const sql = `SELECT cast(verifytime as date) AS date  , cardtype as type, SUM(cardvalue) as value FROM payment_card_log
    WHERE ([status] = 1 OR [status] = 2) AND verifytime >= @0 AND verifytime < @1
    GROUP BY  [cardtype], cast(verifytime as date)
    ORDER BY [cardtype]`;
    const t = await this.paymentRepo.query(sql, [form, to]);
    return t;
  }

  async count() {
    return this.paymentRepo.count();
  }

  /**
   *
   * @returns {Promise<number>}
   */
  async sumMomey(): Promise<number> {
    const { total = 0 } = await this.paymentRepo
      .createQueryBuilder('p')
      .select('Sum(p.cardvalue)', 'total')
      .where('p.status = 1 OR p.status = 2')
      .getRawOne<{ total: number }>();
    return total;
  }

  async sumMoneyToday(): Promise<number> {
    const { total = 0 } = await this.paymentRepo
      .createQueryBuilder('p')
      .select('Sum(p.cardvalue)', 'total')
      .where('(p.status = 1 OR p.status = 2)')
      .andWhere('cast(p.verifytime as date) = cast(getdate() as date)')
      .getRawOne<{ total: number }>();
    return total || 0;
  }

  async list(
    paged = 1,
    filter: ISearchPaymentParams,
  ): Promise<[PaymentEntity[], number]> {
    const limit = Number(filter.limit);
    const offset = (Number(paged) - 1) * limit;
    const where: FindOptionsWhere<PaymentEntity> = {
      status: filter?.status || 0,
    };
    return this.paymentRepo.findAndCount({
      where,
      take: limit,
      skip: offset,
      order: {
        createdAt: 'DESC',
      },
    });
  }

  async historiesByUserName(paged = 1, filter: ISearchPaymentParams) {
    const limit = Number(filter.limit);
    const offset = (Number(paged) - 1) * limit;
    const where: FindOptionsWhere<PaymentEntity> = {
      userName: filter.keyword,
    };
    return this.paymentRepo.findAndCount({
      where,
      take: limit,
      skip: offset,
      order: {
        createdAt: 'DESC',
      },
    });
  }

  async total(): Promise<number> {
    return await this.paymentRepo.count();
  }
}

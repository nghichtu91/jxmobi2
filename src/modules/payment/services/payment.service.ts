import { CardTypes, GATEWAY_URL } from '@config';
import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AxiosResponse } from 'axios';
import { Observable } from 'rxjs';
import { Repository, Between, Like, In } from 'typeorm';
import { IPaymentResponseB, ISearchPaymentParams, PaymentModel } from '../dtos';
import { CreatePaymentDTO } from '../dtos/create.dto';
import { IPaymentUpdateDTO } from '../dtos/update.dto';
import { PaymentEntity } from '../entities';

interface IPaymentService {
  checkCardMobi?: any;
  list(paged: number, filters: ISearchPaymentParams): any;
  total(filter: ISearchPaymentParams): Promise<number>;
}

@Injectable()
export class PaymentService implements IPaymentService {
  constructor(
    @InjectRepository(PaymentEntity)
    private paymentRepo: Repository<PaymentEntity>,
    private readonly httpService: HttpService,
  ) {}

  checkCardMobi(data: any): Observable<AxiosResponse<IPaymentResponseB>> {
    return this.httpService.post<IPaymentResponseB>(GATEWAY_URL, data);
  }

  instert(data: CreatePaymentDTO) {
    const creating = this.paymentRepo.create(data);
    return this.paymentRepo.save(creating);
  }

  async getUserNameByTransId(trans_id: string): Promise<PaymentEntity> {
    const findUsers = await this.paymentRepo.find({
      where: {
        transactionCode: trans_id,
      },
    });
    return findUsers[0];
  }

  updateStatus(trans_id: string, status: number, message?: string) {
    return this.paymentRepo.update(
      {
        transactionCode: trans_id,
      },
      {
        status: status,
        comment: message,
      },
    );
  }

  update(trans_id: string, data: IPaymentUpdateDTO) {
    const createUpdate = this.paymentRepo.create(data);
    return this.paymentRepo.update(
      {
        transactionCode: trans_id,
      },
      createUpdate,
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

  async getPaymentsByUsername(
    userName: string,
    paged = 1,
    pageSize = 12,
  ): Promise<PaymentEntity[]> {
    // != 'ATM' OR cardtype !='atm'
    const sql = `SELECT coin as coin, id, status, cardpin as cardPin, gateway_api as gateway, cardtype as cardType, content as comment, cardvalue as cardValue, cardseri as cardSeri FROM (
      SELECT ROW_NUMBER() OVER(ORDER BY id DESC) AS Numero,
             * FROM payment_card_log WHERE username =@2 AND cardtype IN (@3, @4, @5)
        ) AS TBL
WHERE Numero BETWEEN ((@0 - 1) * @1 + 1) AND (@0 * @1) 
ORDER BY id DESC`;

    return this.paymentRepo
      .query(sql, [
        paged,
        pageSize,
        userName,
        CardTypes.MOBIFONE,
        CardTypes.VIETTEL,
        CardTypes.VINAPHONE,
      ])
      .then((s: PaymentModel[]) =>
        s.map((c) => {
          return this.paymentRepo.create(c);
        }),
      );
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
  ): Promise<PaymentEntity[]> {
    const { limit = 12, status, keyword = '', form, to } = filter;
    let subSql = `SELECT ROW_NUMBER() OVER(ORDER BY createtime DESC) AS Numero, * FROM payment_card_log`;

    const wheres: string[] = [`cardtype IN (@6, @7, @8, @9)`];

    if (status) {
      wheres.push('status = @2');
    }

    if (keyword != '' && keyword) {
      wheres.push('username LIKE @3');
    }

    if (form && to) {
      wheres.push('createtime BETWEEN @4 AND @5');
    }

    if (wheres.length > 0) {
      subSql = `${subSql} WHERE ${wheres.join(' AND ')}`;
    }

    const sql = `SELECT coin as coin, username as userName, createtime as createdAt, id, status, cardpin as cardPin, gateway_api as gateway, cardtype as cardType, content as comment, cardvalue as cardValue, cardseri as cardSeri FROM (${subSql}) AS TBL
                WHERE Numero BETWEEN ((@0 - 1) * @1 + 1) AND (@0 * @1) 
            ORDER BY id DESC`;

    return this.paymentRepo
      .query(sql, [
        paged,
        limit,
        status,
        keyword ? `%${keyword}%` : '',
        form,
        to,
        CardTypes.MOBIFONE,
        CardTypes.VIETTEL,
        CardTypes.VINAPHONE,
        CardTypes.ATM,
      ])
      .then((s: PaymentModel[]) =>
        s.map((c) => {
          return this.paymentRepo.create(c);
        }),
      );
  }

  async total(filter: ISearchPaymentParams): Promise<number> {
    const { keyword = '', form, to, status } = filter;
    const where: any = {
      cardType: In([
        CardTypes.MOBIFONE,
        CardTypes.VIETTEL,
        CardTypes.VINAPHONE,
        CardTypes.ATM,
      ]),
    };

    if (keyword !== '' && keyword) {
      where.userName = Like(`%${keyword}%`);
    }

    if (status > 0) {
      where.status = status;
    }

    if (form && to) {
      where.createdAt = Between(form, to);
    }

    return await this.paymentRepo.count({
      where: where,
    });
  }
}

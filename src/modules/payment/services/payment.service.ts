import { CardTypes } from '@config';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, Like, In, UpdateResult } from 'typeorm';
import { ISearchPaymentParams } from '../dtos';
import { ICreatePaymentDto } from '../dtos/createPayment.dto';
import { IPaymentUpdateDTO } from '../dtos/update.dto';
import { PaymentEntity } from '../entities';

interface IPaymentService {
  //list(paged: number, filters: ISearchPaymentParams): any;
  //total(filter: ISearchPaymentParams): Promise<number>;
  add(createDto: ICreatePaymentDto): Promise<PaymentEntity>;
  update(id: number, updateDto: IPaymentUpdateDTO): Promise<UpdateResult>;
}

@Injectable()
export class PaymentService implements IPaymentService {
  constructor(
    @InjectRepository(PaymentEntity)
    private paymentRepo: Repository<PaymentEntity>,
  ) {}

  add(data: ICreatePaymentDto) {
    const creating = this.paymentRepo.create(data);
    return this.paymentRepo.save(creating);
  }

  updateStatus(id: number, status: number, message?: string) {
    return this.paymentRepo.update(
      {
        id: id,
      },
      {
        status: status,
        comment: message,
      },
    );
  }

  update(id: number, updateDto: IPaymentUpdateDTO) {
    const updateEntity = this.paymentRepo.create({
      ...updateDto,
      coin: updateDto.cardValue,
    });

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

  // async list(
  //   paged = 1,
  //   filter: ISearchPaymentParams,
  // ): Promise<PaymentEntity[]> {}

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

import { BaseEntity, Column, PrimaryColumn, Entity } from 'typeorm';
import { IUserPlayTimeModel } from '../dtos/playtime.model';
import { IBaseModel } from '@shared';

@Entity({ name: 'Account_Habitus' })
export class UserPlayTimeEntity
  extends BaseEntity
  implements IBaseModel<IUserPlayTimeModel>
{
  @PrimaryColumn({ name: 'cAccName', type: 'varchar' })
  userName: string;
  @Column({
    name: 'dEndDate',
    type: 'datetime',
  })
  endDate: Date = new Date(2050, 11, 17, 3, 24, 0);
}

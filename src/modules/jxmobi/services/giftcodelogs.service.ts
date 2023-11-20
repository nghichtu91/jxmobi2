import { Equal, Repository } from 'typeorm';
import { GiftcodelogsEntity } from '../entties/giftcodelogs.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { IGiftCodeLogCreateDto } from '../dtos/giftcode/giftcodelogcreate.dto';

export interface IGiftcodelogsService {
  isEist(Code: string, ActiveRole: number, ServerID: number): Promise<boolean>;
  create(createDto: IGiftCodeLogCreateDto): Promise<GiftcodelogsEntity>;
}

export class GiftcodelogsService implements IGiftcodelogsService {
  constructor(
    @InjectRepository(GiftcodelogsEntity)
    private readonly giftCodeReporitory: Repository<GiftcodelogsEntity>,
  ) {}

  create(createDto: IGiftCodeLogCreateDto): Promise<GiftcodelogsEntity> {
    const giftcodelog = this.giftCodeReporitory.create(createDto);
    return this.giftCodeReporitory.save(giftcodelog);
  }

  isEist(Code: string, ActiveRole: number, ServerID: number): Promise<boolean> {
    return this.giftCodeReporitory.exist({
      where: {
        Code: Equal(Code),
        ActiveRole: Equal(ActiveRole),
        ServerID: Equal(ServerID),
      },
    });
  }
}

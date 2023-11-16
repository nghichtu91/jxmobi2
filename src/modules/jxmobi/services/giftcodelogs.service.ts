import { Equal, Repository } from 'typeorm';
import { GiftcodelogsEntity } from '../entties/giftcodelogs.entity';
import { InjectRepository } from '@nestjs/typeorm';

export interface IGiftcodelogsService {
  isEist(Code: string, ActiveRole: number, ServerID: number): Promise<boolean>;
}

export class GiftcodelogsService implements IGiftcodelogsService {
  constructor(
    @InjectRepository(GiftcodelogsEntity)
    private readonly giftCodeReporitory: Repository<GiftcodelogsEntity>,
  ) {}

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

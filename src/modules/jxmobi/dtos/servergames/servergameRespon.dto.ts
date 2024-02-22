import { IServergameDto } from './servergame.dto';

export interface IServergameRepDto {
  RecommendListServerData: IServergameDto[];
  ListServerData: IServergameDto[];
}

export class ServergameRepDto implements IServergameRepDto {
  RecommendListServerData: IServergameDto[];
  ListServerData: IServergameDto[];
}

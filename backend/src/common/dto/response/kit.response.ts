import { Type } from 'class-transformer';
import { Kit } from './base.response';

class KitResponseData extends Kit {}

export class KitResponse {
  success: boolean;
  message: string;
  @Type(() => KitResponseData)
  data: KitResponseData;
}

export class ListKitResponse {
  success: boolean;
  message: string;
  @Type(() => KitResponseData)
  data: KitResponseData[];
}

import { BaseDto } from './base/base.dto';

export interface DropdownDto extends BaseDto {
  category: string;
  categoryDD: string;
  code: string;
  description: string;
  seqNo: number;
  tags: string;
}

import { BaseDto } from './base/base.dto';

export interface DropdownDto extends BaseDto {
  isNewCategory: boolean;
  category: string;
  categoryDD: string;
  code: string;
  description: string;
  seqNo: number;
  tags: string;
}

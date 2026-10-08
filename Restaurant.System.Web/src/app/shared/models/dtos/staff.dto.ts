import { BaseDto } from './base.dto';
import { RoleDto } from './role.dto';

export interface StaffDto extends BaseDto {
  staffType: string;
  roleList: RoleDto[];
}

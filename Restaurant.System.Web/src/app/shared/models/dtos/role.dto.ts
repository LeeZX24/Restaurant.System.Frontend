import { BaseDto } from './base.dto';

export interface RoleDto extends BaseDto {
  roleCode: string;
  roleName: string;
}

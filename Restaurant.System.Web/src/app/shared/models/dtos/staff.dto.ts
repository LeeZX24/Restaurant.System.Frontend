import { ApplicationDto } from './application.dto';
import { RoleDto } from './role.dto';

export interface StaffDto extends ApplicationDto {
  roleList: RoleDto[];
}

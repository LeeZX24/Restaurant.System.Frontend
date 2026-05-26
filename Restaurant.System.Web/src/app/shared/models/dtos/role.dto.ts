import { BaseDto } from "./base/base.dto";

export interface RoleDto extends BaseDto {
  roleCode: string;
  roleName: string;
}

import { BaseDto } from "./base/base.dto";

export interface UserDto extends BaseDto {
  email?: string;
  userName?: string;
  password: string;
  token?: string;
}

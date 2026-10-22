import { BaseDto } from './base.dto';
import { UserDto } from './user.dto';

export interface StaffDto extends BaseDto {
  username: string;
  email: string;
  lastName: string;
  firstName: string;
  middleName: string;
  userInfo: UserDto;
}
import { BaseDto } from "./base/base.dto";

export interface UserDto extends BaseDto {
  identifier: string;
  userType: UserType;
  token: string;
  expireAt: string | null;
  roles: string[];
  customerId: string;
}

export enum UserType {
    Member,
    Staff
}

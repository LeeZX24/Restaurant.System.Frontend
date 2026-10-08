import { BaseDto } from './base.dto';

export interface UserDto {
  userType?: UserType;
  roles?: string[];
  customerId?: string;
  profileInfo?: ProfileDto;
  accountInfo?: AccountDto;
}

export interface AccountDto {
  identifier?: string;
  username?: string;
  emailAddress?: string;
  userType?: UserType;
}

export interface ProfileDto {
  lastName?: string;
  firstName?: string;
  middleName?: string;
  profilePicUrl?: string;
  addressInfo?: AddressDto;
}

export interface AddressDto {
  address1?: string;
  address2?: string;
  address3?: string;
  postalCode?: string;
  state?: string;
  country?: string;
}


export enum UserType {
  Member,
  Staff,
}

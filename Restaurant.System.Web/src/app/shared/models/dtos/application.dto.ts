import { AddressDto } from './address.dto';
import { UserDto } from './user.dto';

export interface ApplicationDto extends UserDto {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  dateOfBirth: string;
  address: AddressDto;
  fullName: string;
}

import { BaseRequestDto } from "../base/request.dto";
import { BaseResponseDto } from "../base/response.dto";
import { UserDto } from "../user.dto";

export interface LoginRequestDto extends BaseRequestDto {
  identifier?: string;
  password?: string;
}

export interface LoginResponseDto extends BaseResponseDto {
    token?: string;
    expireAt?: Date;
    userInfo?: UserDto;
}
import { BaseRequestDto } from "../base/request.dto";
import { BaseResponseDto } from "../base/response.dto";
import { UserDto } from "../user.dto";

export interface LogoutRequestDto extends BaseRequestDto {
  userInfo?: UserDto;
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface LogoutResponseDto extends BaseResponseDto {
}
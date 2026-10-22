import { BaseRequestDto } from "../base/request.dto";
import { BaseResponseDto } from "../base/response.dto";
import { UserDto } from "../user.dto";

export interface ChangePasswordRequestDto extends BaseRequestDto {
    userInfo?: UserDto;
    newPassword?: string;
}

export interface ChangePasswordResponseDto extends BaseResponseDto {
    passwordChanged?: boolean;
}
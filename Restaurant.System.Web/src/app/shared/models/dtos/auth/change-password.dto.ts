import { BaseRequestDto } from "../base/request.dto";
import { BaseResponseDto } from "../base/response.dto";

export interface ChangePasswordRequestDto extends BaseRequestDto {
    password?: string;
}

export interface ChangePasswordResponseDto extends BaseResponseDto {
    passwordChanged?: boolean;
}
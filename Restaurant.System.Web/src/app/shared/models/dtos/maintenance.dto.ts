import { BaseRequestDto } from "./base/request.dto";
import { BaseResponseDto } from "./base/response.dto";

export interface MaintenanceRequestDto<T> extends BaseRequestDto {
    data?: T;
}

export interface MaintenanceResponseDto<T> extends BaseResponseDto {
    data?: T;
}
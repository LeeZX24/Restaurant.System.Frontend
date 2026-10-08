import { BaseRequestDto } from "../base/request.dto";
import { BaseResponseDto } from "../base/response.dto";

export interface RegisterRequestDto extends BaseRequestDto {
    identifier?: string;
    password?: string;
    registrarInfo?: RegistrarDto;
    customerId?: string;
}

export interface RegistrarDto {
    lastName?: string;
    firstName?: string;
    middleName?: string;
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface RegisterResponseDto extends BaseResponseDto {
}
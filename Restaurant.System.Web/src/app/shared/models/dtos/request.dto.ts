import { UserDto } from './user.dto';
import { BaseRequestDto } from "./base/request.dto";

export interface RequestDto extends BaseRequestDto {
    userInfo?: UserDto;
    route: string;
    action: string;
}

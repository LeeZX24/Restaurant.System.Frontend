import { UserDto } from "../user.dto";
import { BaseResponse } from "./base-response";

export interface LoginResponse extends BaseResponse<UserDto> {

}

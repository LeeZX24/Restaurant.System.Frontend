import { BaseRequest } from "./base-request";

export interface RegisterRequest extends BaseRequest {
  register: string;
  passwordHash: string;
  customerNumber: string;
  isEmail: boolean;
}

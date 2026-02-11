import { BaseRequest } from "./base-request";

export interface LoginRequest extends BaseRequest {
  login: string;
  passwordHash: string;
  customerNumber: string;
  isEmail: boolean;
}

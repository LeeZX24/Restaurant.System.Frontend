import { environment } from "../../../environments/environment";
import { BaseRequestDto } from "../models/dtos/base/request.dto";

export function createBaseRequestData(): BaseRequestDto {
   return {
    userAgent: navigator.userAgent,
    appVersion: environment.version
  };
}

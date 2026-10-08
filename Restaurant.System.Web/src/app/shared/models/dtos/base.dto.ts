import { RequestDto } from './request.dto';
import { ResponseDto } from './response.dto';

export interface BaseDto {
  requestDetails: RequestDto;
  responseDetails: ResponseDto;
}

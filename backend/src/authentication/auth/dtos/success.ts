import { Expose } from 'class-transformer';

export class SuccessDto {
  @Expose()
  success: boolean;
}

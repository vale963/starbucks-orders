import { IsInt } from 'class-validator';
export class CreatePaymentDto {
  @IsInt() orderId: number;
}
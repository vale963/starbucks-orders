import { IsInt, IsPositive } from 'class-validator';
export class AddCartItemDto {
  @IsInt() userId: number;
  @IsInt() productId: number;
  @IsInt() @IsPositive() quantity: number;
}
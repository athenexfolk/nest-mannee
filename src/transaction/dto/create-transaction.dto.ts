import { Type } from 'class-transformer';
import { IsDate, IsIn, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateTransactionDto {
  @Type(() => Date)
  @IsDate()
  date: Date;

  @IsIn(['income', 'expense'])
  type: 'income' | 'expense';

  @IsNumber({ maxDecimalPlaces: 2 })
  amount: number;

  @IsString()
  category: string;

  @IsOptional()
  @IsString()
  note?: string;
}

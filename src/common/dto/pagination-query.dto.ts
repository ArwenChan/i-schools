import { Type } from 'class-transformer';
import { IsOptional, IsPositive, Min } from 'class-validator';

export class PaginationQueryDto {
  @IsOptional()
  @IsPositive()
  @Type(() => Number) // it's in query, always string, so allow this tranform
  limit: number;

  @Min(0)
  @Type(() => Number)
  offset: number;
}

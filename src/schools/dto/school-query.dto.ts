import { Type } from 'class-transformer';
import { IsEnum, IsOptional, Length, Min } from 'class-validator';
import { SchoolStage } from '../entities/school.entity';

export class SchoolQueryDto {
  @Min(0)
  @Type(() => Number)
  offset: number;

  @Length(6, 6)
  readonly area: string;

  @IsEnum(SchoolStage)
  readonly stage: SchoolStage;

  @IsOptional()
  readonly search: string;
}

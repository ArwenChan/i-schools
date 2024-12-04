import { IsEnum, IsOptional, IsUrl, Length, MaxLength } from 'class-validator';
import { SchoolCategory, SchoolStage } from '../entities/school.entity';

export class CreateSchoolDto {
  @MaxLength(55)
  readonly name: string;

  @IsOptional()
  @MaxLength(55)
  readonly former_name: string;

  @IsOptional()
  @IsUrl()
  readonly picture: string;

  @IsEnum(SchoolCategory)
  readonly category: SchoolCategory;

  @IsEnum(SchoolStage)
  readonly stage: SchoolStage;

  @MaxLength(150)
  readonly enroll_pattern: string;

  @IsOptional()
  @MaxLength(50)
  readonly contact: string;

  @IsOptional()
  @IsUrl()
  readonly website: string;

  @MaxLength(150)
  readonly address: string;

  @Length(6, 6)
  readonly region_code: string;
}

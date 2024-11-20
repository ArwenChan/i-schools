import { IsEnum, IsUUID, MaxLength, ValidateIf } from 'class-validator';
import { EventCategory } from '../entities/event.entity';

export class CreateEventDto {
  @IsEnum(EventCategory)
  readonly type: EventCategory;

  @IsUUID(4)
  @ValidateIf((obj) => obj.type !== EventCategory.ADVICE)
  readonly target: string;

  @MaxLength(200)
  @ValidateIf((obj) => obj.type !== EventCategory.LIKE)
  readonly content: string;
}

import { MaxLength } from 'class-validator';

export class UpdateEventDto {
  @MaxLength(200)
  readonly content: string;
}

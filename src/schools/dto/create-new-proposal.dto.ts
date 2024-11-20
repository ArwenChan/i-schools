import { Length, MaxLength } from 'class-validator';

export class NewProposalDto {
  @MaxLength(55)
  readonly name: string;

  @Length(6, 6)
  readonly region_code: string;
}

import { IsBoolean, IsInt, Max, MaxLength, Min } from 'class-validator';
import { AnyOf } from '../../common/decorators/validate.decorator';

@AnyOf(['rating', 'content', 'anonymous'])
export class UpdateCommentDto {
  @IsInt()
  @Min(0)
  @Max(10)
  readonly rating: number;

  @MaxLength(250)
  readonly content: string;

  @IsBoolean()
  readonly anonymous: boolean;
}

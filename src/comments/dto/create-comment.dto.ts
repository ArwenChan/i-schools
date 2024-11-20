import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsUUID,
  Max,
  MaxLength,
  Min,
} from 'class-validator';
import { CommentCategory } from '../entities/comment.entity';

export class CreateCommentDto {
  @IsEnum(CommentCategory)
  readonly category: CommentCategory;

  @IsInt()
  @Min(0)
  @Max(10)
  readonly rating: number;

  @MaxLength(250)
  readonly content: string;

  @IsUUID(4)
  readonly school: string;

  @IsBoolean()
  readonly anonymous: boolean;
}

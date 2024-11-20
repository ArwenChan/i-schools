import { IsEnum, IsIn, IsOptional } from 'class-validator';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';
import { CommentCategory } from '../entities/comment.entity';

export class CommentQueryDto extends PaginationQueryDto {
  @IsOptional()
  @IsEnum(CommentCategory)
  filter: CommentCategory;

  @IsIn(['hot', 'new'])
  order: string;
}

import {
  Controller,
  Post,
  Body,
  Patch,
  Param,
  ParseUUIDPipe,
  Get,
  Query,
  NotFoundException,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { User } from '../common/decorators/user.decorator';
import { User as UserEntity } from '../users/entities/user.entity';
import { CommentQueryDto } from './dto/comment-query.dto';

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post()
  create(@Body() createCommentDto: CreateCommentDto, @User() user: UserEntity) {
    return this.commentsService.create(createCommentDto, user);
  }

  @Get('user/school/:schoolId')
  async getUserSchoolComment(
    @User() user: UserEntity,
    @Param('schoolId', ParseUUIDPipe) schoolId: string,
  ) {
    const comment = await this.commentsService.getUserSchoolComment(
      schoolId,
      user,
    );
    return comment;
  }

  @Get('school/:schoolId')
  getSchoolComments(
    @Param('schoolId', ParseUUIDPipe) schoolId: string,
    @Query() commentsQuery: CommentQueryDto,
  ) {
    return this.commentsService.getSchoolComments(schoolId, commentsQuery);
  }

  // @Patch(':id')
  // update(
  //   @Param('id', ParseUUIDPipe) id: string,
  //   @Body() updateCommentDto: UpdateCommentDto,
  // ) {
  //   return this.commentsService.update(id, updateCommentDto);
  // }
}

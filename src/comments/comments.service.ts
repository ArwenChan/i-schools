import {
  ConflictException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, Repository } from 'typeorm';
import { Comments } from '../comments/entities/comment.entity';
import { User } from '../users/entities/user.entity';
import { SchoolsService } from '../schools/schools.service';
import { CommentQueryDto } from './dto/comment-query.dto';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comments)
    private readonly commentRepository: Repository<Comments>,
    @Inject(forwardRef(() => SchoolsService))
    private readonly schoolsService: SchoolsService,
  ) {}
  async create(createCommentDto: CreateCommentDto, user: User) {
    const existsComment = await this.getUserSchoolComment(
      createCommentDto.school,
      user,
    );
    if (existsComment) {
      throw new ConflictException('The user has commented the school.');
    }
    const school = await this.schoolsService.findOne(createCommentDto.school);
    const comment = this.commentRepository.create({
      ...createCommentDto,
      school,
      author: user,
    });
    await this.commentRepository.save(comment);
    return createCommentDto;
  }

  // async update(id: string, updateCommentDto: UpdateCommentDto) {
  //   const comment = await this.commentRepository.preload({
  //     id,
  //     ...updateCommentDto,
  //   });
  //   if (!comment) {
  //     throw new NotFoundException(`comment ${id} not exists`);
  //   }
  //   return this.commentRepository.save(comment);
  // }

  async findOne(id: string) {
    const comment = await this.commentRepository.findOne({
      where: { id },
    });
    if (!comment) {
      throw new NotFoundException(`comment ${id} not exists`);
    }
    return comment;
  }

  async getUserSchoolComment(schoolId: string, user: User) {
    const comment = await this.commentRepository.findOne({
      where: { author: { id: user.id }, school: { id: schoolId } },
    });
    if (!comment) {
      throw new NotFoundException(`user did not comment this school.`);
    }
    return comment;
  }

  async getSchoolComments(schoolId: string, commentsQuery: CommentQueryDto) {
    const pageSize = commentsQuery.limit || 30;
    const offset = commentsQuery.offset;
    const findOption: FindManyOptions<Comments> = {
      select: {
        author: {
          id: true,
          openid: true,
          name: true,
          avatar: true,
        },
      },
      relations: ['author'],
      skip: offset,
      take: pageSize,
      order: {
        [commentsQuery.order === 'new' ? 'create_time' : 'likes']: 'DESC',
      },
    };
    if (commentsQuery.filter) {
      findOption.where = {
        school: { id: schoolId },
        category: commentsQuery.filter,
      };
    } else {
      findOption.where = {
        school: { id: schoolId },
      };
    }
    const comments = await this.commentRepository.find(findOption);
    if (comments.length < pageSize) {
      return { data: comments };
    }
    return { data: comments, nextCursor: offset + pageSize };
  }
}

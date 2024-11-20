import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateSchoolDto } from './dto/create-school.dto';
import { UpdateSchoolDto } from './dto/update-school.dto';
import { School } from './entities/school.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { NewProposal, UpdateProposal } from './entities/proposal.entity';
import { NewProposalDto } from './dto/create-new-proposal.dto';
import { UpdateProposalDto } from './dto/create-update-proposal.dto';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import { SchoolQueryDto } from './dto/school-query.dto';
import { CommentsService } from '../comments/comments.service';
import { CommentQueryDto } from '../comments/dto/comment-query.dto';

@Injectable()
export class SchoolsService {
  constructor(
    @InjectRepository(School)
    private readonly schoolRepository: Repository<School>,
    @InjectRepository(NewProposal)
    private readonly newProposalRepository: Repository<NewProposal>,
    @InjectRepository(UpdateProposal)
    private readonly updateProposalRepository: Repository<UpdateProposal>,
    @Inject(forwardRef(() => CommentsService))
    private readonly commentsService: CommentsService,
  ) {}

  async createByBatch(schools: CreateSchoolDto[]) {
    return this.schoolRepository.insert(schools);
  }

  async findAll(schoolQuery: SchoolQueryDto) {
    const pageSize = 30;
    const { offset, area, stage, search } = schoolQuery;
    const schoolsQuery = this.schoolRepository
      .createQueryBuilder('school')
      .select([
        'school.id',
        'school.name',
        'school.former_name',
        'school.picture',
        'school.category',
        'school.region_code',
        'school.stage',
        'school.rating',
        'school.comment_best',
        'school.create_time',
        'school.update_time',
      ])
      .where('school.region_code = :area', { area })
      .andWhere('school.stage = :stage', { stage });
    if (search) {
      schoolsQuery.andWhere('school.name like :search', {
        search: `%${search}%`,
      });
    }
    const schools = await schoolsQuery.skip(offset).take(pageSize).getMany();
    if (schools.length < 10) {
      return { data: schools };
    }
    return { data: schools, nextCursor: offset + pageSize };
  }

  // async findPublic() {
  //   const pageSize = 10;
  //   const schools = await this.schoolRepository.find({
  //     select: {
  //       id: true,
  //     },
  //     order: {
  //       create_time: 'ASC',
  //     },
  //     take: pageSize,
  //   });
  //   return schools;
  // }

  async findOne(id: string) {
    const school = await this.schoolRepository.findOne({
      where: { id },
    });
    if (!school) {
      throw new NotFoundException(`school ${id} not exists`);
    }
    return school;
  }

  async findOneWithComments(id: string) {
    const school = await this.findOne(id);
    const query = new CommentQueryDto();
    query.offset = 0;
    query.limit = 10;
    query.order = 'hot';
    const commentsResult = await this.commentsService.getSchoolComments(
      id,
      query,
    );
    return { school, comments: commentsResult.data };
  }

  async update(id: string, updateSchoolDto: UpdateSchoolDto) {
    const school = await this.schoolRepository.preload({
      id: id,
      ...updateSchoolDto,
    });
    if (!school) {
      throw new NotFoundException(`school ${id} not exists`);
    }
    return this.schoolRepository.save(school);
  }

  async newProposal(author: User, newProposalDto: NewProposalDto) {
    const proposal = this.newProposalRepository.create({
      ...newProposalDto,
      author,
    });
    return this.newProposalRepository.save(proposal);
  }

  async updateProposal(
    id: string,
    author: User,
    updateProposalDto: UpdateProposalDto,
  ) {
    const school = await this.findOne(id);
    const proposal = this.updateProposalRepository.create({
      update_content: updateProposalDto,
      school,
      author,
    });
    await this.updateProposalRepository.save(proposal);
    return updateProposalDto;
  }
}

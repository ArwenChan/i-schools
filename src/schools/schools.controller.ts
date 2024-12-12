import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  ParseArrayPipe,
  ParseUUIDPipe,
  Query,
} from '@nestjs/common';
import { SchoolsService } from './schools.service';
import { CreateSchoolDto } from './dto/create-school.dto';
import { UpdateSchoolDto } from './dto/update-school.dto';
import { Public, Role, Roles } from '../common/decorators/auth.decorator';
import { User } from '../common/decorators/user.decorator';
import { NewProposalDto } from './dto/create-new-proposal.dto';
import { User as UserEntity } from '../users/entities/user.entity';
import { UpdateProposalDto } from './dto/create-update-proposal.dto';
import { SchoolQueryDto } from './dto/school-query.dto';

@Controller('schools')
export class SchoolsController {
  constructor(private readonly schoolsService: SchoolsService) {}

  @Get('regions')
  regions() {
    return {
      '440000': {
        '440100': ['primary'], // 广州
        '440300': ['primary'], // 深圳
        '440400': ['primary'], // 珠海
        '441900': ['primary'], // 东莞
        '440600': ['primary'], //佛山
        '442000': ['primary'], //中山
        '440500': ['primary'], //汕头
        '440200': ['primary'], //韶关
      },
    };
  }

  @Post('multiple')
  @Roles(Role.Admin)
  createMultiple(
    @Body(new ParseArrayPipe({ items: CreateSchoolDto }))
    createSchoolDtos: CreateSchoolDto[],
  ) {
    return this.schoolsService.createByBatch(createSchoolDtos);
  }

  @Get()
  findAll(@Query() schoolQuery: SchoolQueryDto) {
    return this.schoolsService.findAll(schoolQuery);
  }

  @Get('public/:id')
  @Public()
  findOneWithTenComments(@Param('id', ParseUUIDPipe) id: string) {
    return this.schoolsService.findOneWithComments(id);
  }

  // @Get('public')
  // @Public()
  // findPublicSchools() {
  //   return this.schoolsService.findPublic();
  // }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.schoolsService.findOne(id);
  }

  @Patch(':id')
  @Roles(Role.Admin)
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateSchoolDto: UpdateSchoolDto,
  ) {
    return this.schoolsService.update(id, updateSchoolDto);
  }

  @Post('new')
  newProposal(
    @Body() newProposalDto: NewProposalDto,
    @User() user: UserEntity,
  ) {
    return this.schoolsService.newProposal(user, newProposalDto);
  }

  @Post('update/:id')
  updateProposal(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateProposalDto: UpdateProposalDto,
    @User() user: UserEntity,
  ) {
    return this.schoolsService.updateProposal(id, user, updateProposalDto);
  }
}

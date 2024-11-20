import { PartialType } from '@nestjs/mapped-types';
import { CreateSchoolDto } from './create-school.dto';

export class UpdateProposalDto extends PartialType(CreateSchoolDto) {}

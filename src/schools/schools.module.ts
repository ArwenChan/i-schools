import { forwardRef, Module } from '@nestjs/common';
import { SchoolsController } from './schools.controller';
import { SchoolsService } from './schools.service';
import { School } from './entities/school.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NewProposal, UpdateProposal } from './entities/proposal.entity';
import { CommentsModule } from '../comments/comments.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([School, NewProposal, UpdateProposal]),
    forwardRef(() => CommentsModule),
  ],
  controllers: [SchoolsController],
  providers: [SchoolsService],
  exports: [SchoolsService],
})
export class SchoolsModule {}

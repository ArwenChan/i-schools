import { forwardRef, Module } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CommentsController } from './comments.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comments } from './entities/comment.entity';
import { SchoolsModule } from '../schools/schools.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Comments]),
    forwardRef(() => SchoolsModule),
  ],
  controllers: [CommentsController],
  providers: [CommentsService],
  exports: [CommentsService],
})
export class CommentsModule {}

import { Module } from '@nestjs/common';
import { EventsService } from './events.service';
import { EventsController } from './events.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommentsModule } from '../comments/comments.module';
import { Event } from './entities/event.entity';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([Event]), CommentsModule, UsersModule],
  controllers: [EventsController],
  providers: [EventsService],
})
export class EventsModule {}

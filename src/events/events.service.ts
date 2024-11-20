import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { User } from '../users/entities/user.entity';
import { DataSource, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CommentsService } from '../comments/comments.service';
import { Event, EventCategory } from './entities/event.entity';
import { UsersService } from '../users/users.service';
import { MyLoggerService } from '../logger/logger.service';

@Injectable()
export class EventsService {
  private readonly logger = new MyLoggerService(EventsService.name);

  constructor(
    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>,
    @Inject(CommentsService)
    private readonly commentsService: CommentsService,
    @Inject(UsersService)
    private readonly usersService: UsersService,
    private readonly datasource: DataSource,
  ) {}

  async create(user: User, createEventDto: CreateEventDto) {
    let targetComment = null;
    if (createEventDto.target) {
      targetComment = await this.commentsService.findOne(createEventDto.target);
    }
    const event = this.eventRepository.create({
      ...createEventDto,
      target: targetComment,
      user,
    });
    if (event.type === EventCategory.LIKE) {
      const queryRunner = this.datasource.createQueryRunner();
      await queryRunner.connect();
      await queryRunner.startTransaction();
      try {
        targetComment.likes++;
        await queryRunner.manager.save(targetComment);
        await queryRunner.manager.save(event);

        await queryRunner.commitTransaction();
      } catch (error) {
        this.logger.log(
          `fail to commit change for creating like event:${createEventDto}`,
        );
        this.logger.error(error);
        queryRunner.rollbackTransaction();
      } finally {
        queryRunner.release(); // release the db connection
      }
    } else {
      await this.eventRepository.save(event);
    }
    return createEventDto;
  }

  async findAll(user: User) {
    const userWithEvents = await this.usersService.getWithEvents(user);
    return userWithEvents.events;
  }

  async findOne(id: string) {
    const event = await this.eventRepository.findOne({ where: { id } });
    if (!event) {
      throw new NotFoundException(`Event ${id} not exists.`);
    }
    return event;
  }

  async remove(id: string) {
    const event = await this.findOne(id);
    if (event.target && event.type === EventCategory.LIKE) {
      const queryRunner = this.datasource.createQueryRunner();
      await queryRunner.connect();
      await queryRunner.startTransaction();
      try {
        event.target.likes--;
        await queryRunner.manager.save(event.target);
        await queryRunner.manager.remove(event);

        await queryRunner.commitTransaction();
      } catch (error) {
        this.logger.log(`fail to commit change for removing like event:${id}`);
        this.logger.error(error);
        queryRunner.rollbackTransaction();
      } finally {
        queryRunner.release(); // release the db connection
      }
    } else {
      await this.eventRepository.remove(event);
    }
    return event;
  }

  async update(id: string, updateEventDto: UpdateEventDto) {
    const event = await this.eventRepository.preload({
      id,
      ...updateEventDto,
    });
    if (!event) {
      throw new NotFoundException(`Event ${id} not exists.`);
    }
    return this.eventRepository.save(event);
  }
}

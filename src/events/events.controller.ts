import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  ParseUUIDPipe,
  Delete,
} from '@nestjs/common';
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { User } from '../common/decorators/user.decorator';
import { User as UserEntity } from '../users/entities/user.entity';

@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Post()
  create(@User() user: UserEntity, @Body() createEventDto: CreateEventDto) {
    return this.eventsService.create(user, createEventDto);
  }

  @Get()
  findAll(@User() user: UserEntity) {
    return this.eventsService.findAll(user);
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.eventsService.findOne(id);
  }

  // @Patch(':id')
  // update(
  //   @Param('id', ParseUUIDPipe) id: string,
  //   @Body() updateEventDto: UpdateEventDto,
  // ) {
  //   return this.eventsService.update(id, updateEventDto);
  // }

  // @Delete(':id')
  // remove(@Param('id', ParseUUIDPipe) id: string) {
  //   return this.eventsService.remove(id);
  // }
}

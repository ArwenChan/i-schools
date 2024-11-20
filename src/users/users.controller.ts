import { Controller, Get, Body, Patch } from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from '../common/decorators/user.decorator';
import { User as UserEntity } from './entities/user.entity';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('self')
  profile(@User() user: UserEntity) {
    return user;
  }

  @Patch('self')
  update(@User() user: UserEntity, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(user, updateUserDto);
  }
}

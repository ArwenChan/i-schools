import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User, UserPlatform } from './entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findOneByOpenId(openid: string) {
    const user = await this.userRepository.findOne({
      where: { openid },
    });
    if (!user) {
      throw new NotFoundException(`user with openid ${openid} not exists`);
    }
    return user;
  }

  async findOrCreateOneByOpenId(openid: string, platform: UserPlatform) {
    let user = await this.userRepository.findOne({
      where: { openid },
    });
    if (!user) {
      user = this.userRepository.create({
        openid,
        platform,
      });
      await this.userRepository.save(user);
    }
    return user;
  }

  async update(user: User, updateUserDto: UpdateUserDto) {
    const updated = await this.userRepository.preload({
      ...user,
      ...updateUserDto,
    });
    return this.userRepository.save(updated);
  }

  async getWithEvents(user: User) {
    const profileUser = await this.userRepository.findOne({
      where: { id: user.id },
      relations: ['events'],
    });
    return profileUser;
  }
}

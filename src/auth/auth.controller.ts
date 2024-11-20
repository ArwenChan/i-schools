import {
  Body,
  Controller,
  Post,
  HttpCode,
  HttpStatus,
  UnauthorizedException,
  Get,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/auth.dto';
import { Public } from '../common/decorators/auth.decorator';
import { User } from '../common/decorators/user.decorator';
import { User as UserEntity } from '../users/entities/user.entity';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  @Public()
  signIn(@Body() signInDto: SignInDto) {
    if (signInDto.platform === 'wechat') {
      const tokenResult = this.authService.wechatSignIn(signInDto.code);
      return tokenResult;
    } else {
      throw new UnauthorizedException('Unsupported platform.');
    }
  }

  @Get('image-token')
  getImageToken(@User() user: UserEntity) {
    const name = `${user.id}.jpeg`;
    const tokenResult = this.authService.getImageToken(name);
    return tokenResult;
  }
}

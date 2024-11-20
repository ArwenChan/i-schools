import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { UsersService } from '../users/users.service';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '../common/decorators/auth.decorator';
import { MyLoggerService } from '../logger/logger.service';

@Injectable()
export class AuthGuard implements CanActivate {
  private readonly logger = new MyLoggerService(AuthGuard.name);

  constructor(
    private readonly jwtService: JwtService,
    @Inject(UsersService)
    private readonly usersService: UsersService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    try {
      if (!token) {
        throw 'no token';
      }
      const payload = this.jwtService.verify(token);
      if (payload.user) {
        const user = await this.usersService.findOneByOpenId(payload.user);
        request['user'] = user;
        return true;
      } else {
        throw 'invalid token.';
      }
    } catch (e) {
      this.logger.error(e);
      throw new UnauthorizedException(e.message);
    }
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}

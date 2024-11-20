import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { codeToSession } from '../common/api';
import { UserPlatform } from '../users/entities/user.entity';
import qiniu from 'qiniu';
import { MyLoggerService } from '../logger/logger.service';

@Injectable()
export class AuthService {
  private readonly logger = new MyLoggerService(AuthService.name);

  constructor(
    @Inject(UsersService)
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async wechatSignIn(code: string): Promise<{ access_token: string }> {
    const APPID = this.configService.get<string>('wechat.appid');
    const APPSECRET = this.configService.get<string>('wechat.secret');
    try {
      const data = await codeToSession(APPID, APPSECRET, code);
      await this.usersService.findOrCreateOneByOpenId(
        data.openid,
        UserPlatform.WECHAT,
      );
      const payload = { session: data.session_key, user: data.openid };
      return {
        access_token: await this.jwtService.sign(payload),
      };
    } catch (e) {
      this.logger.error(e);
      throw new UnauthorizedException(e.message);
    }
  }

  async getImageToken(name: string) {
    const accessKey = this.configService.get<string>('image.access_key');
    const secretKey = this.configService.get<string>('image.secret_key');
    const bucket = this.configService.get<string>('image.bucket');
    const mac = new qiniu.auth.digest.Mac(accessKey, secretKey);
    const options = {
      scope: bucket + ':' + name,
      insertOnly: 0,
      mimeLimit: 'image/*',
    };
    const putPolicy = new qiniu.rs.PutPolicy(options);
    const uploadToken = putPolicy.uploadToken(mac);
    return { upload_token: uploadToken };
  }
}

import { IsEnum, MaxLength } from 'class-validator';
import { UserPlatform } from '../../users/entities/user.entity';

export class SignInDto {
  @MaxLength(36)
  readonly code: string;

  @IsEnum(UserPlatform)
  readonly platform: UserPlatform;
}

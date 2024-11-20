import { IsUrl, MaxLength } from 'class-validator';
import { AnyOf } from '../../common/decorators/validate.decorator';

@AnyOf(['name', 'avatar'])
export class UpdateUserDto {
  @MaxLength(30)
  name: string;

  @IsUrl()
  avatar: string;
}

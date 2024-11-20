import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Relation,
} from 'typeorm';
import { Event } from '../../events/entities/event.entity';
import { Role } from '../../common/decorators/auth.decorator';

export enum UserPlatform {
  WECHAT = 'wechat',
  H5 = 'h5',
  TT = 'TikTok',
}

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar', { length: 30, unique: true })
  openid: string;

  @Column('varchar', { length: 30, nullable: true })
  unionID: string;

  @Column('varchar', { nullable: true, length: 30 })
  name: string;

  @Column({ nullable: true })
  avatar: string;

  @Column('varchar', { nullable: true, length: 11, unique: true })
  phone: string;

  @OneToMany(() => Event, (event) => event.user)
  events: Relation<Event[]>;

  @Column({
    type: 'enum',
    enum: UserPlatform,
    default: UserPlatform.WECHAT,
  })
  platform: UserPlatform;

  @Column({
    type: 'enum',
    array: true,
    enum: Role,
    default: [Role.User],
  })
  roles: Role[];
}

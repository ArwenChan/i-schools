import { User } from '../../users/entities/user.entity';
import { Comments } from '../../comments/entities/comment.entity';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Relation,
  UpdateDateColumn,
} from 'typeorm';

export enum EventCategory {
  LIKE = 'like',
  REPORT = 'report',
  ADVICE = 'advice',
}

@Entity()
export class Event extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: EventCategory,
  })
  type: EventCategory;

  @ManyToOne(() => User, (user) => user.events)
  user: Relation<User>;

  @ManyToOne(() => Comments, { nullable: true, eager: true })
  target: Relation<Comments>;

  @Column('varchar', { nullable: true, length: 200 })
  content: string;

  @Column('varchar', { nullable: true, length: 50 })
  reply: string;

  @CreateDateColumn()
  create_time: number;

  @UpdateDateColumn()
  update_time: number;
}

import { School } from '../../schools/entities/school.entity';
import { User } from '../../users/entities/user.entity';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Relation,
  Unique,
  UpdateDateColumn,
} from 'typeorm';

export enum CommentCategory {
  STUDENT = 'student',
  PARENT = 'parent',
  TEACHER = 'teacher',
  ANYONE = 'anyone',
}

@Entity()
@Unique('school_user', ['school', 'author'])
export class Comments extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: CommentCategory,
  })
  category: CommentCategory;

  @Column('smallint')
  rating: number;

  @Column('varchar', { length: 250 })
  content: string;

  @ManyToOne(() => School, (school) => school.comments)
  school: Relation<School>;

  @ManyToOne(() => User)
  author: Relation<User>;

  @Column()
  anonymous: boolean;

  @Column({ default: 0 })
  likes: number;

  @CreateDateColumn()
  create_time: number;

  @UpdateDateColumn()
  update_time: number;
}

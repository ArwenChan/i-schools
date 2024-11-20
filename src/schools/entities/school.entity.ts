import { User } from '../../users/entities/user.entity';
import { Comments } from '../../comments/entities/comment.entity';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  Index,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Relation,
  UpdateDateColumn,
} from 'typeorm';

export enum SchoolCategory {
  PUBLIC = 'public',
  PRIVATE = 'private',
}

export enum SchoolStage {
  PRESCHOOL = 'preschool',
  PRIMARY = 'primary',
  SECONDARY = 'secondary',
  SENIOR = 'senior',
  VOCATIONAL_SENIOR = 'vocational_senior',
  UNIVERSITY = 'university',
  JUNIOR_COLLEGE = 'junior_college',
  COLLEGE = 'college',
}

@Entity()
export class School extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column('varchar', { length: 55 })
  name: string;

  @Index()
  @Column('varchar', { length: 55, nullable: true })
  former_name: string;

  @Column({ nullable: true })
  picture: string;

  @Column({
    type: 'enum',
    enum: SchoolCategory,
  })
  category: SchoolCategory;

  @Column({
    type: 'enum',
    enum: SchoolStage,
  })
  stage: SchoolStage;

  @Column('varchar', { array: true, length: 50 })
  enroll_pattern: string[];

  @Column('varchar', { nullable: true, array: true, length: 12 })
  contact: string[];

  @Column({ nullable: true })
  website: string;

  @Column('varchar', { length: 150 })
  address: string;

  @ManyToOne((type) => User, { nullable: true })
  author: Relation<User>;

  @Column('char', { length: 6 })
  region_code: string;

  @Column('real', { default: 0 })
  rating: number;

  @Column('int', { default: 0 })
  comment_count: number;

  @Column('varchar', { length: 250, nullable: true })
  comment_best: string;

  @CreateDateColumn()
  create_time: number;

  @UpdateDateColumn()
  update_time: number;

  @OneToMany((type) => Comments, (comment) => comment.school)
  comments: Relation<Comments[]>;
}

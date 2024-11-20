import { User } from '../../users/entities/user.entity';
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
import { School } from './school.entity';

@Entity()
export class NewProposal extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar', { length: 55 })
  name: string;

  @ManyToOne((type) => User)
  author: Relation<User>;

  @Column('char', { length: 6 })
  region_code: string;

  @CreateDateColumn()
  create_time: number;

  @Column({ default: false })
  processed: boolean;

  @Column('varchar', { length: 25, nullable: true })
  processed_result: string;

  @UpdateDateColumn()
  processed_time: number;
}

@Entity()
export class UpdateProposal extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne((type) => School, { eager: true })
  school: Relation<School>;

  @ManyToOne((type) => User)
  author: Relation<User>;

  @Column('json')
  update_content: object;

  @CreateDateColumn()
  create_time: number;

  @Column({ default: false })
  processed: boolean;

  @Column('varchar', { length: 25, nullable: true })
  processed_result: string;

  @UpdateDateColumn()
  processed_time: number;
}

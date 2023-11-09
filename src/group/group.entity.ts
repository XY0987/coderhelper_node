import { User } from 'src/user/user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity()
export class Group {
  // 项目组id
  @PrimaryGeneratedColumn()
  groupId: number;

  // 项目对应用户id
  @Column()
  groupUserId: number;

  // 项目组对应项目id
  @Column()
  groupProjectId: number;

  // 项目组对应用户权限
  @Column()
  groupUserPower: string;
}

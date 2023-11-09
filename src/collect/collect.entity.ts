import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Collect {
  // 主键id
  @PrimaryGeneratedColumn()
  collectId: number;

  // 收藏对应的项目id
  @Column()
  collectProjectId: number;

  // 收藏用户id
  @Column()
  collectUserId: number;
}

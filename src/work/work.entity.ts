import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Work {
  // 设置主键id的注解
  @PrimaryGeneratedColumn()
  workId: number;

  // 任务对应项目id
  @Column()
  workProjectId: number;

  // 任务名称
  @Column()
  workName: string;

  // 任务描述
  @Column()
  workDesc: string;

  // 任务面向用户id
  @Column()
  workUserId: number;

  // 任务创建时间
  @Column()
  workCreateTime: Date;

  // 任务结束时间
  @Column()
  workEndTime: Date;

  // 任务状态
  @Column()
  workStatus: number;

  // 任务提出人id
  @Column()
  workRaiseUserId: number;

  // 任务紧急程度
  @Column()
  workVexation: number;

  // 任务类型
  @Column()
  workType: number;
}

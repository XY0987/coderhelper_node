import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Project {
  // 项目主键id
  @PrimaryGeneratedColumn()
  projectId: number;

  // 项目名称
  @Column()
  projectName: string;

  // 项目描述
  @Column()
  projectDesc: string;

  // 项目接口请求地址
  @Column()
  projectApiUrl: string;

  // 项目访问接口前缀
  @Column()
  projectBaseUrl: number;

  // 项目接口汇总
  @Column()
  projectApiOri: string;

  // 项目是否公开
  @Column({ default: false })
  projectIsPub: boolean;

  // 项目收藏数量
  @Column()
  projectCollectNum: number;

  // 项目需求汇总
  @Column()
  projectDemand: string;
}

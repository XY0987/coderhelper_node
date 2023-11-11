import { Project } from 'src/project/project.entity';
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

// 形成实体类
@Entity()
export class Interface {
  // 主键id
  @PrimaryGeneratedColumn()
  interfaceId: number;

  // 对应项目id
  @Column()
  interfaceProjectId: number;

  // 接口名称
  @Column({ nullable: true })
  interfaceName: string;

  // 接口请求类型
  @Column({ nullable: true })
  interfaceType: string;

  // 接口请求数据类型合集
  @Column({ nullable: true })
  interfaceData: string;

  // 接口返回结果信息合集
  @Column({ nullable: true })
  interfaceRes: string;

  // 接口对应负责人
  @Column({ nullable: true })
  // 与项目组项目组对应的用户id相对应
  interfaceDutyUser: number;

  // 接口状态
  @Column({ nullable: true })
  interfaceStatus: string;

  // 单个接口说明文档
  @Column({ nullable: true })
  interfaceDocs: string;
}

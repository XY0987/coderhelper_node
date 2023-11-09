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
  @Column()
  interfaceName: string;

  // 接口请求类型
  @Column()
  interfaceType: string;

  // 接口请求数据类型合集
  @Column()
  interfaceData: string;

  // 接口返回结果信息合集
  @Column()
  interfaceRes: string;

  // 接口对应负责人
  @Column()
  // 与项目组项目组对应的用户id相对应
  interfaceDutyUser: number;

  // 接口状态
  @Column()
  interfaceStatus: string;

  // 单个接口说明文档
  @Column()
  interfaceDocs: string;
}

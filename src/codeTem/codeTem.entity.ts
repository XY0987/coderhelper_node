import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class CodeTem {
  // 主键id
  @PrimaryGeneratedColumn()
  codeId: number;

  // 代码片段字符串
  @Column('text', { nullable: true })
  codeStr: string;

  // 代码片段类型
  @Column()
  codeType: number;

  // 提出人id
  @Column()
  codeUserId: number;
}

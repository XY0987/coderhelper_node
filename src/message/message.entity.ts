import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Message {
  // 项目组id
  @PrimaryGeneratedColumn()
  messageId: number;

  // 消息标题
  @Column()
  messageTitle: string;

  // 消息内容
  @Column({ nullable: true })
  messageContent: string;

  // 消息对应用户id
  @Column()
  messageToUserId: number;

  // 消息类型
  @Column()
  messageType: number;

  // 消息发出用户id
  @Column()
  messageUserId: number;

  // 消息对应项目id
  @Column()
  messageProjectId: number;
}

import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Meeting {
  // 主键id
  @PrimaryGeneratedColumn()
  meetingId: number;

  // 会议主题
  @Column()
  meetingTheme: string;

  // 会议内容
  @Column()
  meetingContent: number;

  // 会议发出用户id
  @Column()
  meetingUserId: number;

  // 会议开始时间
  @Column()
  meetingStartTime: Date;

  // 会议结束时间
  @Column()
  meetingEndTime: Date;

  // 会议对应项目id
  @Column()
  meetingProjectId: number;

  // 会议总结
  @Column()
  meetingRes: string;
}

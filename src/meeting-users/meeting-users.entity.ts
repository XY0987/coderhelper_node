import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class MeetingUsers {
  // 主键id
  @PrimaryGeneratedColumn()
  meetingUsers: number;

  // 对应会议id
  @Column()
  meetingId: number;

  // 会议对应项目id
  @Column()
  meetingToUserId: number;
}

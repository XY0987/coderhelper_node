import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Meeting } from './meeting.entity';
import { Repository } from 'typeorm';

@Injectable()
export class MeetingService {
  constructor(
    @InjectRepository(Meeting)
    private readonly meetingRepository: Repository<Meeting>,
  ) {}

  create(
    meetingTheme: string,
    meetingContent: string,
    meetingStartTime: string,
    meetingEndTime: string,
    meetingProjectId: number,
    meetingUserId: number,
  ) {
    const statement = `INSERT INTO meeting ( meetingTheme, meetingContent, meetingStartTime, meetingEndTime, meetingProjectId,meetingUserId )
    VALUES
        (?,?,?,?,?,?);`;
    return this.meetingRepository.query(statement, [
      meetingTheme,
      meetingContent,
      meetingStartTime,
      meetingEndTime,
      meetingProjectId,
      meetingUserId,
    ]);
  }

  getMeeting(
    beginIndex: number,
    size: number,
    meetingProjectId: number,
    meetingUserId: number,
  ) {
    const arr = [meetingProjectId, meetingProjectId];
    let str = '';
    if (meetingUserId) {
      arr.push(meetingUserId);
      str = `AND meetingUserId = ?`;
    }
    arr.push(Number(size));
    arr.push((beginIndex - 1) * size);
    const statement = `SELECT
	meeting.*,
	JSON_ARRAYAGG(
	JSON_OBJECT( 'id', userId, 'userName', userName, 'userImg', userImg, 'userSlogan', userSlogan, 'power', userPower, 'groupPower', groupUserPower )) joinInUser 
FROM
	meeting
	LEFT JOIN meeting_users ON meeting.meetingId = meeting_users.meetingId
	LEFT JOIN \`user\` ON userId = meetingToUserId
	LEFT JOIN \`group\` ON groupUserId = meetingToUserId 
	AND groupProjectId = ? 
WHERE
	meetingProjectId = ? 
	${str} 
    LIMIT ? OFFSET ?;`;
    return this.meetingRepository.query(statement, arr);
  }

  getAllMeeting(meetingProjectId: number, meetingUserId: number) {
    const arr = [meetingProjectId];
    let str = '';
    if (meetingUserId) {
      arr.push(meetingUserId);
      str = `AND meetingUserId = ?`;
    }
    const statement = `SELECT
	\`user\`.*,
	meeting.* 
FROM
	meeting
	LEFT JOIN meeting_users ON meeting.meetingId = meeting_users.meetingId
	LEFT JOIN \`user\` ON userId = meetingToUserId 
WHERE
	meetingProjectId = ? 
	${str};`;
    return this.meetingRepository.query(statement, arr);
  }

  getMeetingByuserId(meetingId: number, userId: number) {
    const statement = `SELECT * FROM meeting WHERE meetingId=? AND meetingUserId=?;`;
    return this.meetingRepository.query(statement, [meetingId, userId]);
  }

  // 添加会议总结
  addSummarize(meetingRes: string, meetingId: number) {
    const statement = `UPDATE meeting SET meetingRes=? WHERE meetingId=?;`;
    return this.meetingRepository.query(statement, [meetingRes, meetingId]);
  }
}

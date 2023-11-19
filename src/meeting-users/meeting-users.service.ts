import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MeetingUsers } from './meeting-users.entity';
import { Repository } from 'typeorm';

@Injectable()
export class MeetingUsersService {
  constructor(
    @InjectRepository(MeetingUsers)
    private readonly meetingUsersRepository: Repository<MeetingUsers>,
  ) {}
  create(meetingId, meetingToUserId) {
    const statement = `INSERT INTO meeting_users ( meetingId, meetingToUserId )
    VALUES
        (?,?);`;
    return this.meetingUsersRepository.query(statement, [
      meetingId,
      meetingToUserId,
    ]);
  }
}

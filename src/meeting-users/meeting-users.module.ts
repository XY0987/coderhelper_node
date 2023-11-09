import { Module } from '@nestjs/common';
import { MeetingUsersController } from './meeting-users.controller';
import { MeetingUsersService } from './meeting-users.service';

@Module({
  controllers: [MeetingUsersController],
  providers: [MeetingUsersService],
})
export class MeetingUsersModule {}

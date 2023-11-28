import { Module } from '@nestjs/common';
import { MeetingController } from './meeting.controller';
import { MeetingService } from './meeting.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Meeting } from './meeting.entity';
import { MeetingUsersModule } from 'src/meeting-users/meeting-users.module';
import { MessageModule } from 'src/message/message.module';

@Module({
  imports: [
    MessageModule,
    MeetingUsersModule,
    TypeOrmModule.forFeature([Meeting]),
  ],
  controllers: [MeetingController],
  providers: [MeetingService],
})
export class MeetingModule {}

import { Module } from '@nestjs/common';
import { MeetingUsersController } from './meeting-users.controller';
import { MeetingUsersService } from './meeting-users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MeetingUsers } from './meeting-users.entity';

@Module({
  imports: [TypeOrmModule.forFeature([MeetingUsers])],
  controllers: [MeetingUsersController],
  providers: [MeetingUsersService],
  exports: [MeetingUsersService],
})
export class MeetingUsersModule {}

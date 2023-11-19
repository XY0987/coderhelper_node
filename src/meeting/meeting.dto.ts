import { ApiProperty } from '@nestjs/swagger';

export class CreateMeetingDto {
  @ApiProperty()
  meetingTheme: string;
  @ApiProperty()
  meetingContent: string;
  @ApiProperty()
  meetingStartTime: string;
  @ApiProperty()
  meetingEndTime: string;
  @ApiProperty()
  meetingProjectId: number;
}

export class AddSummarizeDto {
  @ApiProperty()
  meetingRes: string;
  @ApiProperty()
  meetingId: number;
}

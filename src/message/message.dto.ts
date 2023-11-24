import { ApiProperty } from '@nestjs/swagger';

export class CreateMessageDto {
  @ApiProperty()
  messageTitle: string;
  @ApiProperty()
  messageContent: string;
  @ApiProperty()
  messageToUserId: number;
  @ApiProperty()
  messageType: number;
  @ApiProperty()
  messageProjectId: number;
}

import { MessageService } from './../message/message.service';
import { RedisService } from './../redis/redis.service';
import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { MeetingWs } from './meeting';
import { MessageWs } from './message';

@WebSocketGateway(18080, {
  cors: {
    origin: '*',
  },
})
export class EventsGateway {
  userMap: Map<any, any>;
  roomKey: string;
  meetingWs: MeetingWs;
  messageWs: MessageWs;
  constructor(
    private redisService: RedisService,
    private messageService: MessageService,
  ) {
    this.userMap = new Map();
    this.roomKey = 'meeting-room::';
  }

  @SubscribeMessage('message')
  handleMessage(client: any, payload: any) {
    console.log(payload);
    // client.emit('message', 'hello workd');
  }
  @SubscribeMessage('connection')
  handleConnection(client: any) {
    this.meetingWs = new MeetingWs(this.redisService, client);
    this.messageWs = new MessageWs(this.messageService, client);
  }
}

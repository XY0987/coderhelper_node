import { RedisService } from './../redis/redis.service';
import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { MeetingWs } from './meeting';

@WebSocketGateway(18080, {
  cors: {
    origin: '*',
  },
})
export class EventsGateway {
  userMap: Map<any, any>;
  roomKey: string;
  meetingWs: MeetingWs;
  constructor(private redisService: RedisService) {
    this.userMap = new Map();
    this.roomKey = 'meeting-room::';
  }

  @SubscribeMessage('message')
  handleMessage(client: any, payload: any) {
    console.log(payload);
    client.emit('message', 'hello workd');
  }
  @SubscribeMessage('connection')
  handleConnection(client: any) {
    this.meetingWs = new MeetingWs(this.redisService, client);
  }
}

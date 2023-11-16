import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class EventsGateway {
  @SubscribeMessage('message')
  handleMessage(client: any, payload: any) {
    console.log(payload);
    client.emit('message', 'hello workd');
  }
}

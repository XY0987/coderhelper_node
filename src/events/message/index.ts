import { MessageService } from 'src/message/message.service';

/* 
处理消息发送，如果用户在线则直接发送，存储到数据库中
*/
export const allUserMap = new Map();
export class MessageWs {
  messageService: MessageService;
  constructor(messageService: any, ws: any) {
    this.messageService = messageService;
    this.onListener(ws);
  }
  onListener(ws: any) {
    let url = ws.client.request.url;
    let userId = this.getParams(url, 'userId');
    allUserMap.set(userId, ws);
    // 收到信息，发送给指定用户
    ws.on('getMessageClient', (data) => {
      // 收到消息
      const {
        content,
        type,
        userId,
        toUserId,
        messageTitle,
        messageProjectId,
      } = JSON.parse(data);
      const toUserWs = allUserMap.get(`${toUserId}`);
      if (toUserWs) {
        // 用户在线
        toUserWs.emit('sendMessageServer', data);
      }
      //   this.messageService.create(
      //     messageTitle,
      //     content,
      //     toUserId,
      //     type,
      //     userId,
      //     messageProjectId,
      //   );
    });
    ws.on('disconnect', () => {
      console.log(`${userId},下线`);
      allUserMap.delete(userId);
    });
  }
  getParams(url, queryName) {
    let query = decodeURI(url.split('?')[1]);
    let vars = query.split('&');
    for (var i = 0; i < vars.length; i++) {
      var pair = vars[i].split('=');
      if (pair[0] === queryName) {
        return pair[1];
      }
    }
    return null;
  }
  sendMessage(id: number, data: string) {
    const ws = allUserMap.get(`${id}`);
    if (ws) {
      // 发送消息
      ws.emit('sendMessageServer', data);
    }
  }
}

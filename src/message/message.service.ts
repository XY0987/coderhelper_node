import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Message } from './message.entity';
import { Repository } from 'typeorm';
import { allUserMap } from 'src/events/message';

@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
  ) {}

  create(
    messageTitle: string,
    messageContent: string,
    messageToUserId: number,
    messageType: number,
    messageUserId: number,
    messageProjectId: number,
  ) {
    // 加入消息提醒
    const ws = allUserMap.get(`${messageToUserId}`);
    if (ws) {
      ws.emit(
        'sendMessageServer',
        JSON.stringify({
          messageTitle,
          messageContent,
          messageToUserId,
          messageType,
          messageProjectId,
        }),
      );
    }
    const statement = `INSERT INTO message ( messageTitle, messageContent, messageToUserId, messageType, messageUserId, messageProjectId, messageIsRead )
    VALUES
        (?,?,?,?,?,?,?);`;
    return this.messageRepository.query(statement, [
      messageTitle,
      messageContent,
      messageToUserId,
      messageType,
      messageUserId,
      messageProjectId,
      false,
    ]);
  }

  getMessage(
    messageProjectId: number,
    messageType: number,
    messageIsRead: number,
    messageUserId: number,
  ) {
    let str = ``;
    const arr = [];
    arr.push(messageUserId);
    if (messageProjectId) {
      str += ` AND message.messageProjectId=?`;
      arr.push(messageProjectId);
    }
    if (messageType || messageType == 0) {
      str += ` AND message.messageType=?`;
      arr.push(messageType);
    }
    if (messageIsRead || messageIsRead == 0) {
      str += ` AND message.messageIsRead=?`;
      arr.push(messageIsRead);
    }
    const statement = `SELECT * FROM message LEFT JOIN \`user\` ON message.messageToUserId=\`user\`.userId WHERE
     message.messageUserId=?${str};`;
    return this.messageRepository.query(statement, arr);
  }

  // 将用户的指定类型设置为已读
  setIsRead(userId: number, messageType: number) {
    let str = ``;
    let arr = [userId];
    if (messageType || messageType == 0) {
      str = ` AND messageType=?`;
      arr.push(messageType);
    }
    const statement = `UPDATE message SET messageIsRead=1 WHERE messageToUserId=?${str};`;
    return this.messageRepository.query(statement, arr);
  }
}

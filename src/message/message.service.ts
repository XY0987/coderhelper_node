import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Message } from './message.entity';
import { Repository } from 'typeorm';

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
}

import {
  Controller,
  Post,
  Body,
  UseGuards,
  Req,
  Get,
  Query,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { CreateMessageDto } from './message.dto';
import { AuthGuard } from '@nestjs/passport';
import { MessageService } from './message.service';

@Controller('message')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth()
@ApiTags('消息')
export class MessageController {
  constructor(private messageService: MessageService) {}

  @Post('/create')
  @ApiOperation({ summary: '添加消息' })
  async create(@Body() dto: CreateMessageDto, @Req() req) {
    const userId = req.user.userId;
    const {
      messageTitle,
      messageContent,
      messageToUserId,
      messageType,
      messageProjectId,
    } = dto;
    const res = await this.messageService.create(
      messageTitle,
      JSON.stringify({
        content: messageContent,
      }),
      messageToUserId,
      messageType,
      userId,
      messageProjectId,
    );
    return {
      code: 200,
      message: '发送成功',
      data: res,
    };
  }
  @Get('/getMessage')
  @ApiOperation({ summary: '获取当前用户的未读消息' })
  @ApiQuery({
    name: 'messageProjectId',
    type: 'number',
    description: '项目id',
  })
  @ApiQuery({
    name: 'messageType',
    type: 'number',
    description: '消息类型',
  })
  @ApiQuery({
    name: 'messageIsRead',
    type: 'boolean',
    description: '是否阅读(0表示未读，1表示已读)',
  })
  async getMessage(
    @Query()
    {
      messageProjectId,
      messageType,
      messageIsRead,
    }: {
      messageProjectId: number;
      messageType: number;
      messageIsRead: number;
    },
    @Req() req,
  ) {
    const userId = req.user.userId;
    const res = await this.messageService.getMessage(
      messageProjectId,
      messageType,
      messageIsRead,
      userId,
    );
    return {
      code: 200,
      message: '获取成功',
      data: {
        pagingRes: res,
        allTotals: res.length,
      },
    };
  }
  @Get('/setReadMessage')
  @ApiOperation({ summary: '将当前用户指定类型消息设置为已读' })
  @ApiQuery({
    name: 'messageType',
    type: 'number',
    description: '消息类型',
  })
  async setReadMessage(
    @Query() { messageType }: { messageType: number },
    @Req() req,
  ) {
    const userId = req.user.userId;
    const setIsRead = await this.messageService.setIsRead(userId, messageType);
    return {
      code: 200,
      data: setIsRead,
    };
  }
}

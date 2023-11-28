import { RedisService } from 'src/redis/redis.service';
import { MessageService } from 'src/message/message.service';
import { MeetingUsersService } from './../meeting-users/meeting-users.service';
import { MeetingService } from './meeting.service';
import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { AddSummarizeDto, CreateMeetingDto } from './meeting.dto';
import { AuthGuard } from '@nestjs/passport';
import { getErrResMeeting } from 'src/error/meetingError';
import { MessageController } from 'src/message/message.controller';

@Controller('meeting')
@UseGuards(AuthGuard('jwt'))
@ApiTags('会议(未加入监听键值过期提醒)')
export class MeetingController {
  constructor(
    private meetingService: MeetingService,
    private meetingUsersService: MeetingUsersService,
    private messageService: MessageService,
    private redisService: RedisService,
  ) {}

  @Post('/create')
  @ApiOperation({ summary: '创建会议' })
  async create(@Body() dto: CreateMeetingDto, @Req() req) {
    const meetingUserId = req.user.userId;
    const {
      meetingTheme,
      meetingContent,
      meetingStartTime,
      meetingEndTime,
      meetingProjectId,
    } = dto;
    const res = await this.meetingService.create(
      meetingTheme,
      meetingContent,
      meetingStartTime,
      meetingEndTime,
      meetingProjectId,
      meetingUserId,
    );
    return {
      code: 200,
      message: '添加成功',
      data: res,
    };
  }

  // 为会议添加指定用户
  @Get('/joinMeeting')
  @ApiOperation({ summary: '将用户加入到会议中(包括创建者)' })
  @ApiQuery({
    name: 'meetingId',
    type: 'number',
    description: '会议id',
  })
  @ApiQuery({
    name: 'meetingToUserId',
    type: 'number',
    description: '会议对应的用户id',
  })
  async joinMeeting(
    @Query()
    {
      meetingId,
      meetingToUserId,
    }: {
      meetingId: number;
      meetingToUserId: number;
    },
    @Req() req,
  ) {
    const userId = req.user.userId;
    // 查询信息
    const meetingInfo: any[] = await this.meetingService.getMeetingByuserId(
      meetingId,
      userId,
    );
    // 加入消息
    this.messageService.create(
      meetingInfo[0].meetingTheme,
      JSON.stringify({
        content: meetingInfo[0].meetingContent,
        meetingStartTime: meetingInfo[0].meetingStartTime,
      }),
      meetingToUserId,
      2,
      meetingInfo[0].meetingUserId,
      meetingInfo[0].meetingProjectId,
    );
    const time = Date.parse(meetingInfo[0].meetingStartTime) - Date.now();

    // 添加过期提醒
    this.redisService.hSet(
      `meeting-info::${meetingId}-${userId}`,
      `${meetingId}-${userId}`,
      JSON.stringify({
        messageTitle: meetingInfo[0].meetingTheme,
        messageContent: JSON.stringify({
          content: meetingInfo[0].meetingContent,
          meetingStartTime: meetingInfo[0].meetingStartTime,
        }),
        messageToUserId: meetingToUserId,
        messageType: 2,
        messageUserId: meetingInfo[0].meetingUserId,
        messageProjectId: meetingInfo[0].meetingProjectId,
      }),
      parseInt(`${time / 1000}`),
    );
    const res = await this.meetingUsersService.create(
      meetingId,
      meetingToUserId,
    );
    return {
      code: 200,
      data: res,
    };
  }

  // 分页查询会议
  @Get('/getMeeting')
  @ApiOperation({ summary: '分页查询会议' })
  @ApiQuery({
    name: 'beginIndex',
    type: 'number',
    description: '起始页面',
  })
  @ApiQuery({
    name: 'size',
    type: 'number',
    description: '每页条数',
  })
  @ApiQuery({
    name: 'meetingUserId',
    type: 'number',
    description: '发起会议的用户的id(不传查询项目的所有会议)',
  })
  @ApiQuery({
    name: 'meetingProjectId',
    type: 'number',
    description: '项目id',
  })
  async getMeeting(
    @Query()
    {
      beginIndex,
      size,
      meetingProjectId,
      meetingUserId,
    }: {
      beginIndex: number;
      size: number;
      meetingProjectId: number;
      meetingUserId: number;
    },
  ) {
    const pagingRes = await this.meetingService.getMeeting(
      beginIndex,
      size,
      meetingProjectId,
      meetingUserId,
    );
    const allPagingRes = await this.meetingService.getAllMeeting(
      meetingProjectId,
      meetingUserId,
    );
    return {
      code: 200,
      message: '获取成功',
      data: {
        pagingRes,
        allTotals: allPagingRes.length,
      },
    };
  }

  @Post('/addSummarize')
  @ApiOperation({ summary: '添加总结' })
  async addSummarize(@Body() dto: AddSummarizeDto, @Req() req) {
    const userId = req.user.userId;
    const { meetingId, meetingRes } = dto;
    // 判断是否是会议创建者
    const isMeetingOnwer = await this.meetingService.getMeetingByuserId(
      meetingId,
      userId,
    );
    if (isMeetingOnwer.length == 0) {
      return getErrResMeeting(-5001);
    }
    const res = await this.meetingService.addSummarize(meetingRes, meetingId);
    return {
      code: 200,
      message: '添加成功',
      data: res,
    };
  }
}

import { RedisService } from 'src/redis/redis.service';
import { MessageService } from 'src/message/message.service';
import { GroupService } from './../group/group.service';
import { WorkService } from './work.service';
import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { CreateWorkDto, EditWorkDto } from './work.dto';
import { getErrResWork } from 'src/error/workError';

@Controller('work')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth()
@ApiTags('任务')
export class WorkController {
  constructor(
    private workService: WorkService,
    private groupService: GroupService,
    private messageService: MessageService,
    private redisService: RedisService,
  ) {}

  @Post('/create')
  @ApiOperation({ summary: '创建任务(只能给同一个项目组的人发送)' })
  async create(@Body() dto: CreateWorkDto, @Req() req) {
    const userId = req.user.userId;
    const {
      workProjectId,
      workName,
      workDesc,
      workUserId,
      workCreateTime,
      workEndTime,
      workStatus,
      workVexation,
      workType,
    } = dto;
    const groupRes = await this.groupService.findGroupByPIdUId(
      workProjectId,
      userId,
    );
    if (groupRes.length == 0) {
      return getErrResWork(-4001);
    }
    // 发布消息
    this.messageService.create(
      workName,
      JSON.stringify({
        content: workDesc,
        workVexation: workVexation,
        workType: workType,
        workEndTime: workEndTime,
      }),
      workUserId,
      0,
      userId,
      workProjectId,
    );
    // 消息提醒(存入redis)
    const time = Date.parse(workEndTime) - Date.now();
    // 创建任务
    const res = await this.workService.create(
      workProjectId,
      workName,
      workDesc,
      workUserId,
      workCreateTime,
      workEndTime,
      workStatus,
      userId,
      workVexation,
      workType,
    );
    this.redisService.hSet(
      `work-info::${res.insertId}`,
      res.insertId,
      JSON.stringify({
        messageTitle: workName,
        messageContent: JSON.stringify({
          content: workDesc,
          workVexation: workVexation,
          workType: workType,
          workEndTime: workEndTime,
        }),
        messageToUserId: workUserId,
        messageType: 0,
        messageUserId: userId,
        messageProjectId: workProjectId,
      }),
      parseInt(`${time / 1000}`),
    );
    return {
      code: 200,
      message: '创建成功',
      data: res,
    };
  }

  @Get('/getWrokByProjectId')
  @ApiOperation({ summary: '获取项目中的所有任务' })
  @ApiQuery({
    name: 'workProjectId',
    type: 'number',
    description: '项目id',
  })
  @ApiQuery({
    name: 'beginInex',
    type: 'number',
    description: '页数',
  })
  @ApiQuery({
    name: 'size',
    type: 'number',
    description: '条数',
  })
  @ApiQuery({
    name: 'workStatus',
    type: 'number',
    description: '任务状态',
  })
  @ApiQuery({
    name: 'workVexation',
    type: 'number',
    description: '任务紧急程度',
  })
  @ApiQuery({
    name: 'workType',
    type: 'number',
    description: '任务类型',
  })
  async getWrokByProjectId(
    @Query()
    {
      workProjectId,
      beginIndex,
      size,
      workStatus,
      workVexation,
      workType,
    }: {
      workProjectId: number;
      beginIndex: number;
      size: number;
      workStatus: number;
      workVexation: number;
      workType: number;
    },
  ) {
    const pagingRes = await this.workService.getWrokByProjectId(
      workProjectId,
      beginIndex,
      size,
      workStatus,
      workVexation,
      workType,
    );
    const allPagingRes = await this.workService.getAllWrokByProjectId(
      workProjectId,
      workStatus,
      workVexation,
      workType,
    );
    return {
      code: 200,
      message: '查询成功',
      data: {
        pagingRes,
        allTotals: allPagingRes.length,
      },
    };
  }

  // 获取当前用户或传入用户id的所有任务
  @Get('/getUserWork')
  @ApiOperation({ summary: '获取当前用户/传入用户id的所有任务' })
  @ApiQuery({
    name: 'workProjectId',
    type: 'number',
    description: '项目id',
  })
  @ApiQuery({
    name: 'workStatus',
    type: 'number',
    description: '任务状态',
  })
  @ApiQuery({
    name: 'workVexation',
    type: 'number',
    description: '任务紧急程度',
  })
  @ApiQuery({
    name: 'workType',
    type: 'number',
    description: '任务类型',
  })
  @ApiQuery({
    name: 'workUserId',
    type: 'number',
    description: '要查询的用户id',
  })
  async getUserWork(
    @Query()
    {
      workProjectId,
      workStatus,
      workVexation,
      workType,
      workUserId,
    }: {
      workProjectId: number;
      workStatus: number;
      workVexation: number;
      workType: number;
      workUserId?: number;
    },
    @Req() req,
  ) {
    const userId = workUserId ? workUserId : req.user.userId;
    const res = await this.workService.getUserWork(
      workProjectId,
      workStatus,
      workVexation,
      workType,
      userId,
    );
    return {
      code: 200,
      message: '获取成功',
      data: res,
    };
  }

  // 查询当前用户或传入用户id发布的发所有任务
  @Get('/getUserPublishWork')
  @ApiOperation({ summary: '获取用户发布的任务' })
  @ApiQuery({
    name: 'workProjectId',
    type: 'number',
    description: '项目id',
  })
  @ApiQuery({
    name: 'workStatus',
    type: 'number',
    description: '任务状态',
  })
  @ApiQuery({
    name: 'workVexation',
    type: 'number',
    description: '任务紧急程度',
  })
  @ApiQuery({
    name: 'workType',
    type: 'number',
    description: '任务类型',
  })
  @ApiQuery({
    name: 'workRaiseUserId',
    type: 'number',
    description: '任务提出人id',
  })
  async getUserPublishWork(
    @Query()
    {
      workProjectId,
      workStatus,
      workVexation,
      workType,
      workRaiseUserId,
    }: {
      workProjectId: number;
      workStatus: number;
      workVexation: number;
      workType: number;
      workRaiseUserId?: number;
    },
    @Req() req,
  ) {
    const userId = workRaiseUserId ? workRaiseUserId : req.user.userId;
    const res = await this.workService.getUserPublishWork(
      workProjectId,
      workStatus,
      workVexation,
      workType,
      userId,
    );
    return {
      code: 200,
      message: '获取成功',
      data: res,
    };
  }

  @Delete('/delWork')
  @ApiOperation({ summary: '删除任务(未添加消息相关处理)' })
  @ApiQuery({
    name: 'workId',
    type: 'number',
    description: '任务id',
  })
  async delWork(@Query() { workId }: { workId: number }) {
    const res = await this.workService.delWork(workId);
    return {
      code: 200,
      message: '删除成功',
      data: res,
    };
  }

  @Post('/editWork')
  @ApiOperation({ summary: '修改任务(删除重新建立)' })
  async editWork(@Body() dto: EditWorkDto, @Req() req) {
    const { workId } = dto;
    // 删除重建
    const delRes = await this.delWork({ workId });
    // 重新建立
    const createRes = await this.create(dto, req);
    return {
      code: 200,
      message: '修改成功',
      data: {
        delRes,
        createRes,
      },
    };
  }
}

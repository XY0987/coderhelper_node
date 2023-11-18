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
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { CreateWorkDto } from './work.dto';
import { getErrResWork } from 'src/error/workError';

@Controller('work')
@UseGuards(AuthGuard('jwt'))
@ApiTags('任务(未加入消息提醒功能)')
export class WorkController {
  constructor(
    private workService: WorkService,
    private groupService: GroupService,
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
    // 消息提醒(存入redis)
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
  async getWrokByProjectId(
    @Query()
    {
      workProjectId,
      beginIndex,
      size,
      workStatus,
    }: {
      workProjectId: number;
      beginIndex: number;
      size: number;
      workStatus: number;
    },
  ) {
    const res = await this.workService.getWrokByProjectId(
      workProjectId,
      beginIndex,
      size,
      workStatus,
    );
    return {
      code: 200,
      message: '查询成功',
      data: res,
    };
  }

  @Delete('/delWork')
  @ApiOperation({ summary: '删除任务' })
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
}

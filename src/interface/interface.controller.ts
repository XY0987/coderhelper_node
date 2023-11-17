import { GroupService } from './../group/group.service';
import { ProjectService } from './../project/project.service';
import { InterfaceService } from './interface.service';
import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { AddInterfaceDto } from './interface.dto';
import { getErrResProject } from 'src/error/projectError';
import { getErrResInterface } from 'src/error/interfaceError';

@Controller('interface')
@UseGuards(AuthGuard('jwt'))
@ApiTags('接口')
export class InterfaceController {
  constructor(
    private interfaceService: InterfaceService,
    private projectService: ProjectService,
    private groupService: GroupService,
  ) {}

  @Get('/getAllInterface')
  @ApiOperation({ summary: '根据项目id获取项目所有接口' })
  @ApiQuery({
    name: 'projectId',
    type: 'number',
    description: '项目id',
  })
  async getAllInderface(@Query() { projectId }: { projectId }) {
    const res = await this.interfaceService.getAllInterface(projectId);
    return {
      code: 200,
      //   message: '获取成功',
      data: res,
    };
  }

  @Post('/create')
  @ApiOperation({ summary: '创建接口' })
  async create(@Body() dto: AddInterfaceDto, @Req() req) {
    const {
      interfaceProjectId,
      interfaceName,
      interfaceType,
      interfaceData,
      interfaceRes,
      interfaceDutyUser,
      interfaceStatus,
      interfaceDocs,
      interfaceConfig,
    } = dto;
    const userId = req.user.userId;
    // 判断该用户是否在该项目中
    const findUserIsInGroup = await this.groupService.findGroupByPIdUId(
      interfaceProjectId,
      userId,
    );
    if (findUserIsInGroup.length == 0) {
      return getErrResProject(-2002);
    }
    const isHasInterface = await this.interfaceService.findInterfaceIsHas(
      interfaceProjectId,
      interfaceName,
      interfaceType,
    );
    if (isHasInterface.length > 0) {
      return getErrResInterface(-3001);
    }
    // 创建接口
    const res = await this.interfaceService.create(
      interfaceProjectId,
      interfaceName,
      interfaceType,
      interfaceData,
      interfaceRes,
      interfaceDutyUser,
      interfaceStatus,
      interfaceDocs,
      interfaceConfig,
    );
    return {
      code: 200,
      message: '添加成功',
      data: res,
    };
  }
}

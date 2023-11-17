import { UserService } from './../user/user.service';
import { GroupService } from './../group/group.service';
import { ProjectService } from './project.service';
import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  AddProjectConfig,
  AddProjectDemand,
  CreateProjectDto,
} from './project.dto';
import axios from 'axios';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { getErrResProject } from 'src/error/projectError';
import { getErrorResTo } from 'src/error/authError';

@Controller('project')
@UseGuards(AuthGuard('jwt'))
@ApiTags('项目')
export class ProjectController {
  constructor(
    private projectService: ProjectService,
    private groupService: GroupService,
    private userService: UserService,
  ) {}
  @Post('/create')
  @ApiOperation({ summary: '创建项目' })
  async create(@Body() dto: CreateProjectDto, @Req() req) {
    const {
      projectName,
      projectDesc,
      projectApiUrl,
      projectBaseUrl,
      projectIsPub = false,
      projectDemand,
    } = dto;
    let projectApiOri = '';
    try {
      const res = await axios.get(projectApiUrl);
      projectApiOri = JSON.stringify(res.data);
    } catch (error) {
      return getErrResProject(-2001, error);
    }
    const res = await this.projectService.create(
      projectName,
      projectDesc,
      projectApiUrl,
      projectBaseUrl,
      projectApiOri,
      projectIsPub,
      projectDemand,
    );
    const groupRes = await this.groupService.create(
      req.user.userId,
      res.insertId,
      0,
    );
    return {
      code: 200,
      message: '添加成功',
      data: {
        groupRes,
        projectRes: res,
      },
    };
  }

  @Put('/edit')
  @ApiOperation({ summary: '修改项目' })
  @ApiQuery({
    name: 'projectId',
    type: 'number',
    description: '项目id',
  })
  @ApiQuery({
    name: 'projectName',
    type: 'string',
    description: '项目名称',
  })
  @ApiQuery({
    name: 'projectDesc',
    type: 'string',
    description: '项目描述',
  })
  @ApiQuery({
    name: 'projectIsPub',
    type: 'string',
    description: '项目是否公开',
  })
  async editProject(
    @Query()
    {
      projectId,
      projectName,
      projectDesc,
      projectIsPub = 'false',
    }: {
      projectId: number;
      projectName: string;
      projectDesc: string;
      projectIsPub: string;
    },
    @Req() req,
  ) {
    // 判断是否有权限
    const userId = req.user.userId;
    const groupRes = await this.groupService.findGroupByPIdUId(
      projectId,
      userId,
    );
    if (
      groupRes.length == 0 ||
      (groupRes.length && groupRes[0].groupUserPower !== '0')
    ) {
      return getErrResProject(-2002);
    }
    // 权限够，修改项目
    const editRes = await this.projectService.edit(
      projectId,
      projectName,
      projectDesc,
      projectIsPub === 'false' ? false : true,
    );
    return {
      code: 200,
      message: '修改成功',
      data: editRes,
    };
  }

  // 添加/修改项目配置
  @Post('/addProjectConfig')
  @ApiOperation({ summary: '添加项目配置' })
  async addProjectConfig(@Body() dto: AddProjectConfig) {
    const { projectId, config, projectBaseUrl } = dto;
    const res = await this.projectService.addProjectConfig(
      projectId,
      config,
      projectBaseUrl,
    );
    return {
      code: 200,
      message: '添加成功',
      data: res,
    };
  }

  @Post('/addProjectDemand')
  @ApiOperation({ summary: '添加项目需求(仅管理员)' })
  async addProjectDemand(@Body() dto: AddProjectDemand, @Req() req) {
    const { projectId, projectDemand } = dto;
    // 判断是否有权限
    const userId = req.user.userId;
    const groupRes = await this.groupService.findGroupByPIdUId(
      projectId,
      userId,
    );
    if (
      groupRes.length == 0 ||
      (groupRes.length && groupRes[0].groupUserPower !== '0')
    ) {
      return getErrResProject(-2002);
    }
    //修改需求
    const addDemandRes = await this.projectService.addProjectDemand(
      projectId,
      projectDemand,
    );
    return {
      code: 200,
      message: '修改成功',
      data: addDemandRes,
    };
  }

  @Get('/getProject')
  @ApiOperation({
    summary: '分页查询项目',
  })
  @ApiQuery({
    name: 'beginIndex',
    type: 'number',
    description: '开始页数',
  })
  @ApiQuery({
    name: 'size',
    type: 'number',
    description: '每页条数',
  })
  @ApiQuery({
    name: 'power',
    type: 'number',
    description: '在项目中对应权限，不传表示加入的项目',
  })
  async getProject(
    @Query()
    {
      beginIndex = 1,
      size = 10,
      power,
    }: {
      beginIndex: number;
      size: number;
      power?: number;
    },
    @Req() req,
  ) {
    const userId = req.user.userId;
    const pagingRes = await this.projectService.getProjectUserJoinIn(
      userId,
      beginIndex,
      size,
      power,
    );
    const allPagingRes = await this.projectService.getPorjectUserJoinInAll(
      userId,
      power,
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

  @Put('/updateProjectApiOri')
  @ApiOperation({ summary: '更新原始的接口文档' })
  @ApiQuery({
    name: 'projectId',
    type: 'number',
    description: '项目id',
  })
  @ApiQuery({
    name: 'projectApiUrl',
    type: 'string',
    description:
      '接口地址(没有与原始数据合并的过程),可以是新的，也可以是旧的，更新文档',
  })
  async updateProjectApiOri(
    @Query()
    { projectId, projectApiUrl }: { projectId: number; projectApiUrl?: string },
    @Req() req,
  ) {
    // 判断是否有权限
    const userId = req.user.userId;
    const groupRes = await this.groupService.findGroupByPIdUId(
      projectId,
      userId,
    );
    if (
      groupRes.length == 0 ||
      (groupRes.length && groupRes[0].groupUserPower !== '0')
    ) {
      return getErrResProject(-2002);
    }
    let projectApiOri = '';
    try {
      const res = await axios.get(projectApiUrl);
      projectApiOri = JSON.stringify(res.data);
    } catch (error) {
      return getErrResProject(-2001, error);
    }
    const updateRes = await this.projectService.updateProjectApiOri(
      projectId,
      projectApiOri,
      projectApiUrl,
    );
    return {
      code: 200,
      message: '更新成功',
      data: updateRes,
    };
  }

  // 删除项目
  @Delete('/delProject')
  @ApiQuery({
    name: 'projectId',
    type: 'number',
    description: '项目id',
  })
  async delProject(@Query() { projectId }: { projectId: number }, @Req() req) {
    // 判断是否有权限
    const userId = req.user.userId;
    const groupRes = await this.groupService.findGroupByPIdUId(
      projectId,
      userId,
    );
    if (
      groupRes.length == 0 ||
      (groupRes.length && groupRes[0].groupUserPower !== '0')
    ) {
      return getErrResProject(-2002);
    }
    // 删除所有
    const delGroupUsersRes = await this.groupService.delProjectUser(projectId);
    const delProjectRes = await this.projectService.delProject(projectId);
    return {
      code: 200,
      message: '删除成功',
      delGroupUsersRes,
      delProjectRes,
    };
  }

  // 加入项目
  @Get('/joinProject')
  @ApiOperation({ summary: '加入项目' })
  @ApiQuery({
    name: 'userEmail',
    type: 'string',
    description: '用户邮箱',
  })
  @ApiQuery({
    name: 'projectId',
    type: 'number',
    description: '项目id',
  })
  @ApiQuery({
    name: 'power',
    type: 'number',
    description: '用户权限',
  })
  async joinProject(
    @Query()
    {
      projectId,
      userEmail,
      power,
    }: { projectId: number; userEmail: string; power: number },
    @Req() req,
  ) {
    // 判断是否有权限
    const userId = req.user.userId;
    const groupRes = await this.groupService.findGroupByPIdUId(
      projectId,
      userId,
    );
    if (
      groupRes.length == 0 ||
      (groupRes.length && groupRes[0].groupUserPower !== '0')
    ) {
      return getErrResProject(-2002);
    }
    // 判断用户是否加入过
    const userInfo = await this.userService.getUserInfoByEmail(userEmail);
    if (userInfo.length === 0) {
      return getErrorResTo(-1005);
    }
    const joinUserId = userInfo[0].userId;
    const joinUserGroupRes = await this.groupService.findGroupByPIdUId(
      projectId,
      joinUserId,
    );
    if (joinUserGroupRes.length > 0) {
      return getErrResProject(-2003);
    }
    const res = await this.groupService.joinProject(
      projectId,
      joinUserId,
      power,
    );
    return {
      code: 200,
      message: '添加成功',
      data: res,
    };
  }

  // 将用户删除
  @Delete('/delProjectUser')
  @ApiOperation({ summary: '将用户从项目中删除' })
  @ApiQuery({
    name: 'projectId',
    type: 'number',
    description: '项目id',
  })
  @ApiQuery({
    name: 'delUserId',
    type: 'number',
    description: '用户id',
  })
  async delProjectUser(
    @Query() { projectId, delUserId }: { projectId: number; delUserId: number },
    @Req() req,
  ) {
    // 判断是否有权限
    const userId = req.user.userId;
    const groupRes = await this.groupService.findGroupByPIdUId(
      projectId,
      userId,
    );
    if (
      groupRes.length == 0 ||
      (groupRes.length && groupRes[0].groupUserPower !== '0')
    ) {
      return getErrResProject(-2002);
    }
    // if (groupRes[0].groupUserId == userId) {
    //   return getErrResProject(-2004);
    // }
    const delRes = await this.groupService.delProjectUser(projectId, delUserId);
    return {
      code: 200,
      message: '删除成功',
      data: delRes,
    };
  }

  @Get('/getProjectInfo')
  @ApiOperation({ summary: '获取项目的具体信息)' })
  @ApiQuery({
    name: 'projectId',
    type: 'number',
    description: '项目id',
  })
  async getProjectInfo(
    @Query() { projectId }: { projectId: number },
    @Req() req,
  ) {
    const userId = req.user.userId;
    const userRes = await this.groupService.findGroupByPIdUId(
      projectId,
      userId,
    );
    const res = await this.projectService.getProjectInfo(projectId);
    const interfaceRes = await this.projectService.getAllInterface(projectId);
    return {
      code: 200,
      message: '获取成功',
      data: res[0],
      userData: userRes,
      interfaceRes,
    };
  }

  @Get('/getProjectUsers')
  @ApiOperation({ summary: '获取项目的所有用户' })
  @ApiQuery({ name: 'projectId', type: 'string', description: '项目id' })
  async getProjectUsers(@Query() { projectId }: { projectId: number }) {
    const res = await this.groupService.getAllUsersByProjectId(projectId);
    return {
      code: 200,
      message: '获取成功',
      data: res,
    };
  }

  @Get('/getPublicProject')
  @ApiOperation({ summary: '分页查看公开项目，缺少是否收藏信息' })
  @ApiQuery({
    name: 'beginIndex',
    type: 'number',
    description: '页数',
  })
  @ApiQuery({
    name: 'size',
    type: 'number',
    description: '每页条数',
  })
  async getPublicProject(
    @Query() { beginIndex, size }: { beginIndex: number; size: number },
  ) {
    const pagingRes = await this.projectService.getPublicProject(
      beginIndex,
      size,
    );
    const allPagingRes = await this.projectService.getAllPublicProject();
    return {
      code: 200,
      message: '获取成功',
      data: {
        pagingRes,
        allTotals: allPagingRes.length,
      },
    };
  }

  // 收藏项目
  @Get('/collectProject')
  @ApiOperation({ summary: '收藏项目' })
  @ApiQuery({
    name: 'projectId',
    type: 'number',
    description: '项目id',
  })
  async collectProject(
    @Query() { projectId }: { projectId: number },
    @Req() req,
  ) {
    const userId = req.user.userId;
    const isCollectReg = await this.projectService.getProjectIsCollect(
      projectId,
      userId,
    );
    if (isCollectReg.length > 0) {
      return getErrResProject(-2005);
    }
    const res = await this.projectService.collectProject(projectId, userId);
    return {
      code: 200,
      data: res,
      message: '收藏成功',
    };
  }

  @Get('/getCollectProject')
  @ApiOperation({ summary: '分页查询当前用户收藏项目' })
  @ApiQuery({
    name: 'beginIndex',
    type: 'number',
    description: '页数',
  })
  @ApiQuery({
    name: 'size',
    type: 'number',
    description: '每页条数',
  })
  async getCollectProject(
    @Query() { beginIndex, size }: { beginIndex: number; size: number },
    @Req() req,
  ) {
    const userId = req.user.userId;
    const pagingRes = await this.projectService.getCollectProject(
      beginIndex,
      size,
      userId,
    );
    const allPagingRes = await this.projectService.getAllCollectProject(userId);
    return {
      code: 200,
      message: '获取成功',
      data: {
        pagingRes,
        allTotals: allPagingRes.length,
      },
    };
  }

  @Delete('/delCollectProject')
  @ApiOperation({ summary: '取消收藏项目' })
  @ApiQuery({
    name: 'projectId',
    type: 'number',
    description: '项目id',
  })
  async delCollectProject(
    @Query() { projectId }: { projectId: number },
    @Req() req,
  ) {
    const userId = req.user.userId;
    const res = await this.projectService.delCollectProject(projectId, userId);
    return {
      code: 200,
      message: '删除成功',
      data: res,
    };
  }
}

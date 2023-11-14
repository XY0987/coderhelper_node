import { GroupService } from './../group/group.service';
import { ProjectService } from './project.service';
import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CreateProjectDto } from './project.dto';
import axios from 'axios';
import { ApiTags } from '@nestjs/swagger';
import { getErrResProject } from 'src/error/projectError';

@Controller('project')
@UseGuards(AuthGuard('jwt'))
@ApiTags('项目')
export class ProjectController {
  constructor(
    private projectService: ProjectService,
    private groupService: GroupService,
  ) {}
  @Post('/create')
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
}

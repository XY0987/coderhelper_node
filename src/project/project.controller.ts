import { Controller, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Controller('project')
@UseGuards(AuthGuard('jwt'))
export class ProjectController {}

import { Injectable } from '@nestjs/common';
import { Project } from './project.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class ProjectService {
  constructor(
    @InjectRepository(Project)
    private readonly userRepository: Repository<Project>,
  ) {}

  create(
    projectName: string,
    projectDesc: string,
    projectApiUrl: string,
    projectBaseUrl: string,
    projectApiOri: string,
    projectIsPub: boolean,
    projectDemand: string,
  ) {
    const statement = `INSERT INTO project ( projectName, projectDesc, projectApiUrl, projectBaseUrl, projectApiOri, projectIsPub, projectDemand )
    VALUES
      (?,?,?,?,?,?,?);`;
    return this.userRepository.query(statement, [
      projectName,
      projectDesc,
      projectApiUrl,
      projectBaseUrl,
      projectApiOri,
      projectIsPub,
      projectDemand,
    ]);
  }
}

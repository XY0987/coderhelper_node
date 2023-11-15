import { Injectable } from '@nestjs/common';
import { Project } from './project.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class ProjectService {
  constructor(
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
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
    return this.projectRepository.query(statement, [
      projectName,
      projectDesc,
      projectApiUrl,
      projectBaseUrl,
      projectApiOri,
      projectIsPub,
      projectDemand,
    ]);
  }

  edit(
    projectId: number,
    projectName: string,
    projectDesc: string,
    projectIsPub: boolean,
  ) {
    const statement = `UPDATE project SET projectName=?,projectDesc=?,projectIsPub=? WHERE projectId=?;`;
    return this.projectRepository.query(statement, [
      projectName,
      projectDesc,
      projectIsPub,
      projectId,
    ]);
  }

  addProjectConfig(projectId: number, config: string, projectBaseUrl: string) {
    const statement = `UPDATE project 
    SET projectBaseUrl =?,
    projectConfig =? 
    WHERE
      projectId =?;`;
    return this.projectRepository.query(statement, [
      projectBaseUrl,
      config,
      projectId,
    ]);
  }

  addProjectDemand(projectId: number, projectDemand: string) {
    const statement = `UPDATE project SET projectDemand=? WHERE projectId=?;`;
    return this.projectRepository.query(statement, [projectDemand, projectId]);
  }

  //分页查看用户加入的项目
  getProjectUserJoinIn(
    userId: number,
    beginIndex: number,
    size: number,
    power: number,
  ) {
    let state = '';
    const arr = [userId];
    if (power && power != 0) {
      state = `AND groupUserPower=?`;
      arr.push(power);
    }
    arr.push(Number(size));
    arr.push((beginIndex - 1) * size);
    const statement = `SELECT 
    project.projectId projectId,
	  project.projectName projectName,
	  project.projectIsPub projectIsPub,
	  project.projectDesc projectDesc,
	  project.projectApiUrl projectApiUrl,
	  project.projectCollectNum projectCollectNum,
	  project.projectConfig projectConfig,
	  project.projectBaseUrl projectBaseUrl
    FROM \`group\` LEFT JOIN project ON groupProjectId=projectId 
    WHERE groupUserId=? ${state} LIMIT ? OFFSET ?;`;

    return this.projectRepository.query(statement, arr);
  }
  // 查找用户加入的所有项目
  getPorjectUserJoinInAll(userId: number, power: number) {
    let state = '';
    const arr = [userId];
    if (power && power != 0) {
      state = `AND groupUserPower=?`;
      arr.push(power);
    }
    const statement = `SELECT 
    project.projectId projectId,
	  project.projectName projectName,
	  project.projectIsPub projectIsPub,
	  project.projectDesc projectDesc,
	  project.projectApiUrl projectApiUrl,
	  project.projectCollectNum projectCollectNum,
	  project.projectConfig projectConfig,
	  project.projectBaseUrl projectBaseUrl
    FROM
    \`group\` LEFT JOIN project ON groupProjectId=projectId 
    WHERE groupUserId=? ${state};`;
    return this.projectRepository.query(statement, arr);
  }

  getProjectInfo(projectId: number) {
    const statement = `SELECT * FROM project WHERE projectId=?;`;
    return this.projectRepository.query(statement, [projectId]);
  }

  updateProjectApiOri(
    projectId: number,
    projectApiOri: string,
    projectApiUrl: string,
  ) {
    const statement = `UPDATE project SET projectApiOri=?,projectApiUrl=? WHERE projectId=?;`;
    return this.projectRepository.query(statement, [
      projectApiOri,
      projectApiUrl,
      projectId,
    ]);
  }

  delProject(projectId: number) {
    const statement = `DELETE  FROM project WHERE projectId=?;`;
    return this.projectRepository.query(statement, [projectId]);
  }
}

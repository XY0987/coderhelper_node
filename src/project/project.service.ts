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

  // 分页查找公开项目
  getPublicProject(beginIndex: number, size: number) {
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
    project 
  WHERE
    projectIsPub = 1 
    LIMIT ? OFFSET ?;`;
    return this.projectRepository.query(statement, [
      Number(size),
      (beginIndex - 1) * size,
    ]);
  }

  // 获取公开项目的所有
  getAllPublicProject() {
    const statement = `SELECT
    * 
  FROM
    project 
  WHERE
    project.projectIsPub = 1;`;
    return this.projectRepository.query(statement);
  }

  // 分页查询收藏的项目
  getCollectProject(beginIndex: number, size: number, userId: number) {
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
    collect
    LEFT JOIN project ON collect.collectProjectId = project.projectId 
  WHERE 
    collectUserId =? 
    LIMIT ? OFFSET ?;`;
    return this.projectRepository.query(statement, [
      userId,
      Number(size),
      (beginIndex - 1) * size,
    ]);
  }

  // 获取收藏的所有项目
  getAllCollectProject(userId: number) {
    const statement = `SELECT
    *
  FROM
    collect
    LEFT JOIN project ON collect.collectProjectId = project.projectId 
  WHERE 
    collectUserId =?;`;
    return this.projectRepository.query(statement, [userId]);
  }

  // 查找项目是否被收藏过
  getProjectIsCollect(projectId: number, userId: number) {
    const statement = `SELECT
    * 
  FROM
    collect 
  WHERE
    collect.collectProjectId =? 
    AND collect.collectUserId =?;
  `;
    return this.projectRepository.query(statement, [projectId, userId]);
  }

  // 收藏项目
  collectProject(projectId: number, userId: number) {
    const statement = `INSERT INTO collect ( collectProjectId, collectUserId )
    VALUES
      (?,?);`;
    return this.projectRepository.query(statement, [projectId, userId]);
  }

  // 取消收藏项目
  delCollectProject(projectId: number, userId: number) {
    const statement = `DELETE FROM collect 
    WHERE
      collect.collectProjectId =? 
      AND collect.collectUserId =?;`;
    return this.projectRepository.query(statement, [Number(projectId), userId]);
  }

  getProjectInfo(projectId: number) {
    const statement = `SELECT * FROM project WHERE projectId=?;`;
    return this.projectRepository.query(statement, [projectId]);
  }

  // 获取项目中的所有接口
  getAllInterface(projectId: number) {
    const statement = `SELECT * FROM interface WHERE interfaceProjectId=?;`;
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

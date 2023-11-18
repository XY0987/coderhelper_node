import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Interface } from './interface.entity';
import { Repository } from 'typeorm';

@Injectable()
export class InterfaceService {
  constructor(
    @InjectRepository(Interface)
    private readonly interfaceRepository: Repository<Interface>,
  ) {}
  // 获取项目的所有接口
  getAllInterface(projectId) {
    const statement = `SELECT * FROM interface LEFT JOIN \`user\` ON \`user\`.userId=interface.interfaceDutyUser 
    WHERE interfaceProjectId=?;`;
    return this.interfaceRepository.query(statement, [projectId]);
  }

  // 创建接口
  create(
    interfaceProjectId: number,
    interfaceName: string,
    interfaceType: string,
    interfaceData: string,
    interfaceRes: string,
    interfaceDutyUser: string,
    interfaceStatus: number,
    interfaceDocs: string,
    interfaceConfig: string,
  ) {
    const statement = `INSERT INTO interface ( interfaceProjectId, interfaceName, interfaceType, interfaceData, interfaceRes, interfaceDutyUser, interfaceStatus, interfaceDocs, interfaceConfig )
    VALUES
        (?,?,?,?,?,?,?,?,?);`;
    return this.interfaceRepository.query(statement, [
      interfaceProjectId,
      interfaceName,
      interfaceType,
      interfaceData,
      interfaceRes,
      interfaceDutyUser,
      interfaceStatus,
      interfaceDocs,
      interfaceConfig,
    ]);
  }

  // 根据项目id接口请求路径以及接口请求类型查找是否添加过接口
  findInterfaceIsHas(
    interfaceProjectId: number,
    interfaceName: string,
    interfaceType: string,
  ) {
    const statement = `SELECT
	* 
FROM
	interface 
WHERE
	interface.interfaceProjectId =? 
	AND interface.interfaceName =? 
	AND interface.interfaceType =?;`;
    return this.interfaceRepository.query(statement, [
      interfaceProjectId,
      interfaceName,
      interfaceType,
    ]);
  }

  // 删除接口
  delInterface(interfaceId: number) {
    const statement = `DELETE FROM interface WHERE interfaceId=?;`;
    return this.interfaceRepository.query(statement, [interfaceId]);
  }

  // 修改接口
  editInterface(
    interfaceId: number,
    interfaceName?: string,
    interfaceType?: string,
    interfaceData?: string,
    interfaceRes?: string,
    interfaceDutyUser?: number,
    interfaceStatus?: number,
    interfaceDocs?: string,
    interfaceConfig?: string,
  ) {
    const arr = [];
    let str = ``;
    if (interfaceName) {
      str += `interfaceName=?,`;
      arr.push(interfaceName);
    }
    if (interfaceType) {
      str += `interfaceType=?,`;
      arr.push(interfaceType);
    }
    if (interfaceData) {
      str += `interfaceData=?,`;
      arr.push(interfaceData);
    }
    if (interfaceRes) {
      str += `interfaceRes=?,`;
      arr.push(interfaceRes);
    }
    if (interfaceDutyUser) {
      str += `interfaceDutyUser=?,`;
      arr.push(interfaceDutyUser);
    }
    if (interfaceStatus || interfaceStatus == 0 || interfaceStatus == 1) {
      str += `interfaceStatus=?,`;
      arr.push(interfaceStatus);
    }
    if (interfaceDocs) {
      str += `interfaceDocs=?,`;
      arr.push(interfaceDocs);
    }
    if (interfaceConfig) {
      str += `interfaceConfig=?,`;
      arr.push(interfaceConfig);
    }
    if (str.length > 0) {
      str = str.substring(0, str.length - 1);
    }
    arr.push(interfaceId);
    const statement = `UPDATE interface SET ${str} WHERE interfaceId=?;`;
    return this.interfaceRepository.query(statement, arr);
  }

  // 通过接口id查找接口信息
  getInterfaceById(interfaceId: number) {
    const statement = `SELECT * FROM interface LEFT JOIN \`user\` ON interface.interfaceDutyUser=\`user\`.userId WHERE interfaceId=?;`;
    return this.interfaceRepository.query(statement, [interfaceId]);
  }
}

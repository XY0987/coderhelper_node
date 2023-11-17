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
    const statement = `SELECT * FROM interface WHERE interfaceProjectId=?;`;
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
}

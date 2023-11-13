import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}
  // 登录
  signin(userEmail: string, password: string) {
    const statement = `SELECT * FROM user WHERE userEmail=? AND userPassword=?;`;
    return this.userRepository.query(statement, [userEmail, password]);
  }

  // 注册
  create(userEmail: string, password: string) {
    const statement = `INSERT INTO user (userEmail,userPassword) VALUES(?,?);`;
    return this.userRepository.query(statement, [userEmail, password]);
  }

  // 根据用户email获取用户信息
  getUserInfoByEmail(userEmail: string) {
    const statement = `SELECT * FROM user WHERE userEmail=?;`;
    return this.userRepository.query(statement, [userEmail]);
  }

  // 根据用户id获取用户信息
  getUserInfoById(id: number) {
    const statement = `SELECT * FROM user WHERE userId=?;`;
    return this.userRepository.query(statement, [id]);
  }

  // 修改密码
  editPassword(userEmail: string, password: string) {
    const statement = `UPDATE user SET userPassword=? WHERE userEmail=?;`;
    return this.userRepository.query(statement, [password, userEmail]);
  }

  // 修改用户信息
  uploadUserInfo(
    userName: string,
    userImg: string,
    userSlogan: string,
    userId: number,
  ) {
    const statement = `UPDATE user SET userName=?,userImg=?,userSlogan=? WHERE userId=?;`;
    return this.userRepository.query(statement, [
      userName,
      userImg,
      userSlogan,
      userId,
    ]);
  }
}

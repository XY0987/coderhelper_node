import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}
  getUserInfo() {
    return {
      name: 'XY',
    };
  }

  signin(userEmail: string, password: string) {
    const statement = `SELECT * FROM user WHERE userEmail=? AND userPassword=?;`;
    return this.userRepository.query(statement, [userEmail, password]);
  }

  create(userEmail: string, password: string) {
    const statement = `INSERT INTO user (userEmail,userPassword) VALUES(?,?);`;
    return this.userRepository.query(statement, [userEmail, password]);
  }

  getUserInfoByEmail(userEmail: string) {
    const statement = `SELECT * FROM user WHERE userEmail=?;`;
    return this.userRepository.query(statement, [userEmail]);
  }
}

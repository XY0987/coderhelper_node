import { JwtService } from '@nestjs/jwt';
import { UserService } from './../user/user.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwt: JwtService,
  ) {}
  async signin(userName: string, password: string) {
    return await this.jwt.signAsync({
      userName: 'XY',
      sub: 1,
    });
  }
  signup(useName: string, password: string) {}
}

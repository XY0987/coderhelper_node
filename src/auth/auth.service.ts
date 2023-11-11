import { JwtService } from '@nestjs/jwt';
import { UserService } from './../user/user.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwt: JwtService,
  ) {}
  async signin(userEmail: string, password: string) {
    return await this.userService.signin(userEmail, password);
  }
  async signup(userEmail: string, password: string) {
    return await this.userService.create(userEmail, password);
  }
}

import { AuthGuard } from '@nestjs/passport';
import { UserService } from './user.service';
import { Controller, Get, UseGuards } from '@nestjs/common';

@Controller('user')
export class UserController {
  constructor(private readonly UserService: UserService) {}

  @Get()
  @UseGuards(AuthGuard('jwt'))
  getUserInfo() {
    return this.UserService.getUserInfo();
  }
}

import { UserService } from './user.service';
import { Controller, Get } from '@nestjs/common';

@Controller('user')
export class UserController {
  constructor(private readonly UserService: UserService) {}

  @Get()
  getUserInfo() {
    return this.UserService.getUserInfo();
  }
}

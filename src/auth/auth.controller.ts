import { AuthService } from './auth.service';
import { Body, Controller, Post } from '@nestjs/common';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/sigin')
  async sigin(@Body() dto: any) {
    const { userName, password } = dto;
    const res = await this.authService.signin(userName, password);
    return res;
  }

  @Post('/singup')
  singup() {}
}

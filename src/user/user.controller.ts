import { AuthGuard } from '@nestjs/passport';
import { UserService } from './user.service';
import { Controller, Get, Put, Query, Req, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';

@Controller('user')
@ApiTags('用户')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/getuserInfo')
  @ApiOperation({ summary: '获取用户信息' })
  @UseGuards(AuthGuard('jwt'))
  async getUserInfo(@Req() req: any) {
    const userId = req.user.userId;
    const res = await this.userService.getUserInfoById(userId);
    return {
      code: 200,
      data: res[0],
    };
  }

  @Put('/uploadUserInfo')
  @ApiOperation({ summary: '更新用户信息' })
  @UseGuards(AuthGuard('jwt'))
  @ApiQuery({
    name: 'userName',
    type: 'string',
    description: '用户名',
  })
  @ApiQuery({
    name: 'userImg',
    type: 'string',
    description: '用户头像',
  })
  @ApiQuery({
    name: 'userSlogan',
    type: 'string',
    description: '用户格言',
  })
  async updateUserInfo(
    @Req() req: any,
    @Query() query: { userName: string; userImg: string; userSlogan: string },
  ) {
    const userId = req.user.userId;
    const { userName, userImg, userSlogan } = query;
    const res = await this.userService.uploadUserInfo(
      userName,
      userImg,
      userSlogan,
      userId,
    );
    return {
      code: 200,
      message: '修改成功',
      data: res,
    };
  }
}

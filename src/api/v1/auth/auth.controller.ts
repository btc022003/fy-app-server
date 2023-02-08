import { Controller, Get, Post, Body, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { LoginDto, RegDto } from './dto/create-auth.dto';

@ApiTags('登录注册')
@Controller('/api/v1/auth')
export class AuthController {
  constructor(private readonly usersService: AuthService) {}

  @ApiOperation({
    summary: '登陆',
  })
  @Post('login')
  async login(
    @Body() body: LoginDto,
    @Res({ passthrough: true })
    response: Response,
  ) {
    const data = await this.usersService.userLogin(
      body.userName,
      body.pwd,
      // body.type === 1 ? 'captcha' : 'pwd',
      'captcha',
    );
    // 写用户id到cookie中，调用接口的时候直接传递cookie就好
    data.success
      ? response.cookie('token', data.data, {
          httpOnly: true,
          sameSite: 'none',
          secure: true,
        })
      : '';
    return data;
  }

  @ApiOperation({
    summary: '注册',
  })
  @Post('reg')
  async reg(
    @Body() body: RegDto,
    @Res({ passthrough: true })
    response: Response,
  ) {
    const data = await this.usersService.userReg(body);
    response.cookie('token', data.data);
    return data;
  }

  @ApiOperation({
    summary: '房东登陆',
  })
  @Post('ll_login')
  async llLogin(
    @Body() body: LoginDto,
    @Res({ passthrough: true })
    response: Response,
  ) {
    const data = await this.usersService.landLordLogin(
      body.userName,
      body.pwd,
      // body.type === 1 ? 'captcha' : 'pwd',
      'captcha',
    );
    // 写用户id到cookie中，调用接口的时候直接传递cookie就好
    data.success
      ? response.cookie('token', data.data, {
          httpOnly: true,
          sameSite: 'none',
          secure: true,
        })
      : '';
    return data;
  }

  @ApiOperation({
    summary: '房东注册',
  })
  @Post('ll_reg')
  async llReg(
    @Body() body: RegDto,
    @Res({ passthrough: true })
    response: Response,
  ) {
    const data = await this.usersService.landLordReg(body);
    response.cookie('token', data.data);
    return data;
  }

  @ApiOperation({
    summary: '管理后台登陆',
  })
  @Post('admin_login')
  async adminLogin(
    @Body() body: LoginDto,
    @Res({ passthrough: true })
    response: Response,
  ) {
    const data = await this.usersService.adminLogin(body.userName, body.pwd);
    // 写用户id到cookie中，调用接口的时候直接传递cookie就好
    data.success
      ? response.cookie('token', data.data, {
          httpOnly: true,
          sameSite: 'none',
          secure: true,
        })
      : '';
    // console.log(data);
    return data;
  }

  @ApiOperation({
    summary: '管理后台退出',
  })
  @Get('manager_logout')
  async adminLogOut(
    @Res({ passthrough: true })
    response: Response,
  ) {
    response.cookie('token', '');
    return '退出登录成功';
  }
}

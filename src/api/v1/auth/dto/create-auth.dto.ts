import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    description: '用户名',
    default: '',
  })
  @IsNotEmpty({
    message: '用户名不能为空',
  })
  userName: string;
  @ApiProperty({
    description: '密码或者验证码',
    default: '',
  })
  pwd: string;

  @ApiProperty({
    description: '登陆方式,0或者1;0表示验证码登陆,1表示密码登陆',
    default: '',
  })
  type: number;
}

export class RegDto {
  @ApiProperty({
    description: '用户名',
    default: '',
  })
  @IsNotEmpty({
    message: '用户名不能为空',
  })
  userName: string;
  @ApiProperty({
    description: '密码或者验证码',
    default: '',
  })
  pwd: string;
}

export class CreateUserDto {
  @ApiProperty({
    description: '用户名',
    default: '',
  })
  @IsNotEmpty({
    message: '用户名不能为空',
  })
  userName: string;
  @ApiProperty({
    description: '用户密码',
    default: '',
  })
  @IsNotEmpty({
    message: '密码不能为空',
  })
  password: string;
  @ApiProperty({
    description: '昵称',
    default: '',
  })
  @IsNotEmpty({
    message: '昵称不能为空',
  })
  nickName: string;
}

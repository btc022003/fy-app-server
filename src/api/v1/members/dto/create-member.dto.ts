import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateMemberDto {}

export class UpdateMemberIdNum {
  @ApiProperty({
    description: '身份证号码',
  })
  @IsNotEmpty({
    message: '身份证号不能为空',
  })
  idNum: string;

  @ApiProperty({
    description: '真实姓名',
  })
  @IsNotEmpty({
    message: '真实姓名不能为空',
  })
  realName: string;
}

// 重置密码
export class ResetPassword {
  @ApiProperty({
    description: '新密码',
  })
  @IsNotEmpty({
    message: '密码不能为空',
  })
  password: string;

  // repwd: string;
  @ApiProperty({
    description: '验证码',
  })
  @IsNotEmpty({
    message: '验证码不能为空',
  })
  code: string;
}

// 设置密码
export class SetPassword {
  @ApiProperty({
    description: '新密码',
  })
  @IsNotEmpty({
    message: '密码不能为空',
  })
  password: string;
}

export class UpdateMobile {
  @ApiProperty({
    description: '手机号码',
  })
  @IsNotEmpty({
    message: '手机号码不能为空',
  })
  mobile: string;

  @ApiProperty({
    description: '验证码',
  })
  @IsNotEmpty({
    message: '验证码不能为空',
  })
  captcha: string;
}

export class CheckContract {
  @ApiProperty({
    description: '合同id',
  })
  @IsNotEmpty({
    message: '合同id不能为空',
  })
  contractId: string;
}

export class DateHouseRoom {
  @ApiProperty({
    description: '用户id',
  })
  userId?: string;

  @ApiProperty({
    description: '房源id',
  })
  @IsNotEmpty({
    message: '房源id不能为空',
  })
  roomId: string;

  @ApiProperty({
    description: '预约时间',
  })
  @IsNotEmpty({
    message: '预约时间不能为空',
  })
  dateTime: Date;

  @ApiProperty({
    description: '备注',
  })
  remarks?: string;
}

export class RoomRepairAskInfo {
  // roomContractId
  askImage: string;
  remarks: string;
}

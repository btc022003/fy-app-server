import { ApiProperty } from '@nestjs/swagger';
import { isNotEmpty, IsNotEmpty } from 'class-validator';

export class CreateHouseDto {
  @ApiProperty({
    description: '省市区县数据',
    default: '',
  })
  @IsNotEmpty({
    message: '省市区县数据,用-分割',
  })
  region: string;
  @ApiProperty({
    description: '街道数据',
    default: '',
  })
  @IsNotEmpty({
    message: '小区所在街道',
  })
  street: string;
  @ApiProperty({
    description: '社区',
    default: '',
  })
  // @IsNotEmpty({
  //   message: '小区所在社区信息不能为空',
  // })
  community: string;
  @ApiProperty({
    description: '小区名字',
    default: '',
  })
  @IsNotEmpty({
    message: '小区名字不能为空',
  })
  dwelling: string;
  @ApiProperty({
    description: '详细地址',
    default: '',
  })
  @IsNotEmpty({
    message: '小区详细地址不能为空',
  })
  address: string;
  @ApiProperty({
    description: '是否整租',
    default: false,
  })
  @IsNotEmpty({
    message: '租住方式不能为空',
  })
  isWhole: boolean;

  @ApiProperty({
    description: '房屋照片,多个可以使用,分割',
    default: '',
  })
  @IsNotEmpty({
    message: '房屋照片不能为空,多个可以使用,分割',
  })
  images: string;
}

export class CreateHouseRoomDto {
  @ApiProperty({
    description: '房租',
    default: 0,
  })
  @IsNotEmpty({
    message: '房租不能为空',
  })
  price: number;

  @ApiProperty({
    description: '房间详情数据',
    default: '',
  })
  @IsNotEmpty({
    message: '房间详情不能为空',
  })
  content: string;

  @ApiProperty({
    description: '房屋照片,多个可以使用,分割',
    default: '',
  })
  @IsNotEmpty({
    message: '房屋照片不能为空,多个可以使用,分割',
  })
  images: string;

  @ApiProperty({
    description: '房屋设施id,多个用,分割',
    default: '',
  })
  @IsNotEmpty({
    message: '房屋设施id,多个用,分割',
  })
  devices: string;
}

export class HouseQuery {
  @ApiProperty({
    description: '是否整租',
    default: false,
    required: false,
  })
  isWhole: boolean;
  @ApiProperty({
    description: '租金范围下限',
    default: -1,
    required: false,
  })
  minPrice: -1;
  @ApiProperty({
    description: '租金范围上限',
    default: -1,
    required: false,
  })
  maxPrice: number;
  @ApiProperty({
    description: '地区',
    default: '',
    required: false,
  })
  area: string;
}

export class createContract {
  @ApiProperty({
    description: '用户手机号',
    default: '',
  })
  @IsNotEmpty({
    message: '用户手机号不能为空',
  })
  userMobile?: string;
  // @ApiProperty({
  //   description: '房东id',
  //   default: '',
  // })
  // @IsNotEmpty({
  //   message: '房东id不能为空',
  // })
  // landLordId: string;
  @ApiProperty({
    description: '房间id',
    default: '',
  })
  @IsNotEmpty({
    message: '房间不能为空',
  })
  roomId: string;
  @ApiProperty({
    description: '租金',
    default: '',
  })
  @IsNotEmpty({
    message: '价格不能为空',
  })
  price: number;
  @ApiProperty({
    description: '支付方式',
    default: 1,
    required: false,
  })
  payCategory: number;
  @ApiProperty({
    description: '备注',
    default: '',
    required: false,
  })
  remarks: string;

  @ApiProperty({
    description: '合同开始时间',
  })
  startTime: Date;
  @ApiProperty({
    description: '合同结束时间',
  })
  endTime: Date;
}

export class createRepairReply {
  @ApiProperty({
    description: '回复内容',
    default: '',
  })
  replyContent?: string;

  @ApiProperty({
    description: '回复图片，多个用,分割',
    default: '',
  })
  replyImage?: string;
}

import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateNoticeDto {
  @ApiProperty({
    description: '名字',
  })
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    description: '描述',
  })
  desc: string;

  @ApiProperty({
    description: '主图',
  })
  image: string;

  @ApiProperty({
    description: '详细信息',
  })
  content: string;
}

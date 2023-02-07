import { ApiProperty } from '@nestjs/swagger';

export class CreateChatMessageDto {
  @ApiProperty({
    description: '用户id',
    required: true,
  })
  userId: string;
  @ApiProperty({
    description: '房东id',
    required: true,
  })
  landLordId: string;
  @ApiProperty({
    description: '是否来自用户发的消息',
    required: true,
    default: true,
  })
  isFromUser: boolean;
  @ApiProperty({
    description: '消息内容',
    required: true,
  })
  content: string;
}

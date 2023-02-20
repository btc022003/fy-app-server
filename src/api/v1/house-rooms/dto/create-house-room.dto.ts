import { ApiProperty } from '@nestjs/swagger';

export class CreateHouseRoomDto {}

export class QueryIndo {
  @ApiProperty({
    description: '每页显示的数量',
    required: false,
    default: 10,
  })
  per: number;
  @ApiProperty({
    description: '页码',
    required: false,
    default: 1,
  })
  page: number;
}

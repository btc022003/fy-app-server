import { ApiProperty } from '@nestjs/swagger';

export class CreateCustomerDto {}

export class QueryArticleParams {
  @ApiProperty({
    description: '页码',
    required: false,
  })
  page?: number;

  @ApiProperty({
    description: '每页显示的数量',
    required: false,
  })
  per?: number;

  @ApiProperty({
    description: '分类id',
    required: false,
  })
  categoryId?: string;
}

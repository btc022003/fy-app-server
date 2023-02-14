import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CustomerService } from './customer.service';
import {
  CreateCustomerDto,
  QueryArticleParams,
} from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';

@ApiTags('客户端-一般信息')
@Controller('/api/v1/customer')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  // @Post()
  // create(@Body() createCustomerDto: CreateCustomerDto) {
  //   return this.customerService.create(createCustomerDto);
  // }

  @ApiOperation({
    summary: '通知',
  })
  @Get('notices')
  findAllNotice(@Query() query: QueryArticleParams) {
    return this.customerService.loadNotices({}, query.page, query.per);
  }

  @ApiOperation({
    summary: 'id获取一个通知',
  })
  @Get('notices/:id')
  findNoticeById(@Param('id') id: string) {
    return this.customerService.loadNotice(id);
  }

  @ApiOperation({
    summary: '获取分类',
  })
  @Get('article_categories')
  findAllArticleCategories() {
    return this.customerService.loadArticleCategory();
  }

  @ApiOperation({
    summary: '获取文章',
  })
  @Get('articles')
  findArticles(@Query() query: QueryArticleParams) {
    const where: any = {};
    // console.log(query);
    if (query.categoryId) {
      where.articleCategoryId = query.categoryId;
    }
    return this.customerService.loadArticles(where, query.page, query.per);
  }

  @ApiOperation({
    summary: '根据id获取详情',
  })
  @Get('articles/:id')
  findArticleById(@Param('id') id: string) {
    return this.customerService.loadArticle(id);
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.customerService.findOne(+id);
  // }

  // @Patch(':id')
  // update(
  //   @Param('id') id: string,
  //   @Body() updateCustomerDto: UpdateCustomerDto,
  // ) {
  //   return this.customerService.update(+id, updateCustomerDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.customerService.remove(+id);
  // }
}

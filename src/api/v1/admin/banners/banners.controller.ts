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
import { BannersService } from './banners.service';
import { CreateBannerDto, QueryInfo } from './dto/create-banner.dto';
import { UpdateBannerDto } from './dto/update-banner.dto';
import { BaseController } from 'src/api/base/base.controller';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('平台端-轮播图信息')
@Controller('/api/v1/admin/banners')
export class BannersController extends BaseController {
  constructor(private readonly bannerService: BannersService) {
    super(bannerService);
  }

  @ApiOperation({
    summary: '分页形式获取列表数据',
  })
  @Get()
  index(@Query() query: QueryInfo) {
    const { page, per } = query;
    const where: any = {};
    if (query.name) {
      where.name = { contains: query.name };
    }
    if (query.category) {
      where.bannerCategoryId = query.category;
    }
    return this.bannerService.findAll(where, page, per);
  }

  @ApiOperation({
    summary: '新增',
  })
  @Post()
  create(@Body() createArticleDto: CreateBannerDto) {
    return this.bannerService.create(createArticleDto);
  }

  @ApiOperation({
    summary: '修改',
  })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateArticleDto: UpdateBannerDto) {
    return this.bannerService.update(id, updateArticleDto);
  }
}

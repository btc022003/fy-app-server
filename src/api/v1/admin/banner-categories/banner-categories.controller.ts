import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { BannerCategoriesService } from './banner-categories.service';
import { CreateBannerCategoryDto } from './dto/create-banner-category.dto';
import { UpdateBannerCategoryDto } from './dto/update-banner-category.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { BaseController } from 'src/api/base/base.controller';

@ApiTags('平台端-轮播图分类')
@Controller('/api/v1/admin/banner_categories')
export class BannerCategoriesController extends BaseController {
  constructor(
    private readonly bannerCategoriesService: BannerCategoriesService,
  ) {
    super(bannerCategoriesService);
  }

  @ApiOperation({
    summary: '新增',
  })
  @Post()
  create(@Body() createArticleCategoryDto: CreateBannerCategoryDto) {
    return this.bannerCategoriesService.create(createArticleCategoryDto);
  }

  @ApiOperation({
    summary: '修改',
    description: '根据id修改一条数据记录',
  })
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateArticleCategoryDto: UpdateBannerCategoryDto,
  ) {
    return this.bannerCategoriesService.update(id, updateArticleCategoryDto);
  }
}

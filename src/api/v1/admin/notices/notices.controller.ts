import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { NoticesService } from './notices.service';
import { CreateNoticeDto } from './dto/create-notice.dto';
import { UpdateNoticeDto } from './dto/update-notice.dto';
import { BaseController } from 'src/api/base/base.controller';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('平台端-公告')
@Controller('/api/v1/admin/notices')
export class NoticesController extends BaseController {
  constructor(private readonly noticesService: NoticesService) {
    super(noticesService);
  }

  @ApiOperation({
    summary: '新增',
  })
  @Post()
  create(@Body() createNoticeDto: CreateNoticeDto) {
    return this.noticesService.create(createNoticeDto);
  }

  @ApiOperation({
    summary: '修改',
  })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateNoticeDto: UpdateNoticeDto) {
    return this.noticesService.update(id, updateNoticeDto);
  }
}

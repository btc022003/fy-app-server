import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { LandLordsService } from './land-lords.service';
import { CreateLandLordDto } from './dto/create-land-lord.dto';
import { UpdateLandLordDto } from './dto/update-land-lord.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('平台端-房东信息')
@Controller('/api/v1/admin/land_lords')
export class LandLordsController {
  constructor(private readonly landLordsService: LandLordsService) {}

  // @Post()
  // create(@Body() createLandLordDto: CreateLandLordDto) {
  //   return this.landLordsService.create(createLandLordDto);
  // }

  @ApiOperation({
    summary: '房东列表',
  })
  @Get()
  findAll() {
    return this.landLordsService.findAll();
  }

  @Patch('/chk/:id')
  update(
    @Param('id') id: string,
    // @Body() updateLandLordDto: UpdateLandLordDto,
  ) {
    return this.landLordsService.chkLandLord(id);
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.landLordsService.findOne(+id);
  // }

  // @Patch(':id')
  // update(
  //   @Param('id') id: string,
  //   @Body() updateLandLordDto: UpdateLandLordDto,
  // ) {
  //   return this.landLordsService.update(+id, updateLandLordDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.landLordsService.remove(+id);
  // }
}

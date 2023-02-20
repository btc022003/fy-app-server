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

  @ApiOperation({
    summary: '审核资质',
  })
  @Patch('/chk/:id')
  update(
    @Param('id') id: string,
    // @Body() updateLandLordDto: UpdateLandLordDto,
  ) {
    return this.landLordsService.chkLandLord(id);
  }

  @ApiOperation({
    summary: '房间列表数据',
  })
  @Get('/room/:id')
  loadRoomData(
    @Param('id') id: string,
    // @Body() updateLandLordDto: UpdateLandLordDto,
  ) {
    return this.landLordsService.roomInfo(id);
  }

  @ApiOperation({
    summary: '签订的合同信息',
  })
  @Get('/contracts/:id')
  loadRoomContractData(
    @Param('id') id: string,
    // @Body() updateLandLordDto: UpdateLandLordDto,
  ) {
    return this.landLordsService.roomContract(id);
  }

  @ApiOperation({
    summary: '报修的信息',
  })
  @Get('/repairs/:id')
  loadRoomRepairData(
    @Param('id') id: string,
    // @Body() updateLandLordDto: UpdateLandLordDto,
  ) {
    return this.landLordsService.repairs(id);
  }

  @ApiOperation({
    summary: '投诉的信息',
  })
  @Get('/complains/:id')
  loadComplainData(
    @Param('id') id: string,
    // @Body() updateLandLordDto: UpdateLandLordDto,
  ) {
    return this.landLordsService.complains(id);
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

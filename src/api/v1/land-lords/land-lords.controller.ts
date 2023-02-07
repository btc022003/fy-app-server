import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  Query,
  Put,
} from '@nestjs/common';
import { LandLordsService } from './land-lords.service';
import {
  CreateHouseDto,
  CreateHouseRoomDto,
  HouseQuery,
} from './dto/create-land-lord.dto';
// import { UpdateLandLordDto } from './dto/update-land-lord.dto';
import { ApiOperation } from '@nestjs/swagger';

@Controller('land-lords')
export class LandLordsController {
  constructor(private readonly landLordsService: LandLordsService) {}

  @ApiOperation({
    summary: '发布房源信息',
  })
  @Post('publish_house')
  create(@Req() req, @Body() createLandLordDto: CreateHouseDto) {
    return this.landLordsService.createHouse(req.user.id, createLandLordDto);
  }

  @ApiOperation({
    summary: '修改房源信息',
  })
  @Put('house/:id')
  updateHouse(@Param('id') id: string, @Body() updateHouseDto: CreateHouseDto) {
    return this.landLordsService.updateHouse(id, updateHouseDto);
  }

  @ApiOperation({
    summary: '添加房源的房间信息',
  })
  @Post('publish_house_room/:id')
  createRoom(
    @Param('id') id: string,
    @Body() createRoomDto: CreateHouseRoomDto,
  ) {
    return this.landLordsService.createHouseRoom(id, createRoomDto);
  }

  @ApiOperation({
    summary: '修改房源的房间信息',
  })
  @Put('house_room/:id')
  update(
    @Param('id') id: string,
    @Body() updateHouseRoomDto: CreateHouseRoomDto,
  ) {
    return this.landLordsService.updateHouseRoom(id, updateHouseRoomDto);
  }

  @ApiOperation({
    summary: '删除房间信息',
  })
  @Delete('del_room/:id')
  delRoomById(@Param('id') id: string) {
    return this.landLordsService.deleteHouseRoom(id);
  }

  @ApiOperation({
    summary: '房东首页',
  })
  @Get('home')
  findAll(@Req() req) {
    // 房东首页数据
    return this.landLordsService.homeInfo(req.user.id);
  }

  @ApiOperation({
    summary: '房屋数据',
  })
  @Get('houses')
  findHouses(@Req() req, @Query() query: HouseQuery) {
    return this.landLordsService.houses(
      req.user.id,
      query.isWhole,
      query.minPrice,
      query.maxPrice,
      query.area,
    );
  }

  @ApiOperation({
    summary: '根据id获取房源信息',
  })
  @Get('house/:id')
  findOneHouse(@Param('id') id: string) {
    return this.landLordsService.findHouseById(id);
  }

  @ApiOperation({
    summary: '根据id获取房间信息',
  })
  @Get('house_room/:id')
  findOneHouseRoom(@Param('id') id: string) {
    return this.landLordsService.findHouseRoomById(id);
  }

  @ApiOperation({
    summary: '删除房屋数据',
  })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.landLordsService.remove(id);
  }
}

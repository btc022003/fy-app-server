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
} from '@nestjs/common';
import { HouseRoomsService } from './house-rooms.service';
import { CreateHouseRoomDto, QueryIndo } from './dto/create-house-room.dto';
import { UpdateHouseRoomDto } from './dto/update-house-room.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { loadUserId } from 'src/utils/tools';

@ApiTags('客户端-房源信息')
@Controller('/api/v1/house_rooms')
export class HouseRoomsController {
  constructor(private readonly houseRoomsService: HouseRoomsService) {}

  // @Post()
  // create(@Body() createHouseRoomDto: CreateHouseRoomDto) {
  //   return this.houseRoomsService.create(createHouseRoomDto);
  // }

  @ApiOperation({
    summary: '房源数据',
  })
  @Get()
  findAll(@Req() req, @Query() query: QueryIndo) {
    // loadUserId(req, (userId) => {
    //   return this.houseRoomsService.findAll({}, query.page, query.page, userId);
    // });
    // return {};
    return this.houseRoomsService.findAll(
      {},
      query.page,
      query.per,
      loadUserId(req),
    );
  }
  @ApiOperation({
    summary: '房源详情',
  })
  @Get(':id')
  findOne(@Param('id') id: string, @Req() req) {
    // loadUserId(req, (userId) => {
    //   return this.houseRoomsService.findOne(id, userId);
    // });
    // return {};
    return this.houseRoomsService.findOne(id, loadUserId(req));
  }

  // @Patch(':id')
  // update(
  //   @Param('id') id: string,
  //   @Body() updateHouseRoomDto: UpdateHouseRoomDto,
  // ) {
  //   return this.houseRoomsService.update(+id, updateHouseRoomDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.houseRoomsService.remove(+id);
  // }
}

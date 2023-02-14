import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { HouseRoomsService } from './house-rooms.service';
import { CreateHouseRoomDto } from './dto/create-house-room.dto';
import { UpdateHouseRoomDto } from './dto/update-house-room.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@Controller('/api/v1/house-rooms')
export class HouseRoomsController {
  constructor(private readonly houseRoomsService: HouseRoomsService) {}

  // @Post()
  // create(@Body() createHouseRoomDto: CreateHouseRoomDto) {
  //   return this.houseRoomsService.create(createHouseRoomDto);
  // }

  @ApiTags('客户端-房源信息')
  @Get()
  findAll() {
    return this.houseRoomsService.findAll();
  }
  @ApiTags('客户端-房源详细信息')
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.houseRoomsService.findOne(id);
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

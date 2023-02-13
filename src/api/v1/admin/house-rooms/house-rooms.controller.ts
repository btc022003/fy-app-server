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

@ApiTags('平台端-房源信息')
@Controller('/api/v1/admin/house_rooms')
export class HouseRoomsController {
  constructor(private readonly houseRoomsService: HouseRoomsService) {}

  @Post()
  create(@Body() createHouseRoomDto: CreateHouseRoomDto) {
    return this.houseRoomsService.create(createHouseRoomDto);
  }

  @Get()
  findAll() {
    return this.houseRoomsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.houseRoomsService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateHouseRoomDto: UpdateHouseRoomDto,
  ) {
    return this.houseRoomsService.update(+id, updateHouseRoomDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.houseRoomsService.remove(+id);
  }
}

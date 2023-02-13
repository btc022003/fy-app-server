import { Injectable } from '@nestjs/common';
import { CreateHouseRoomDto } from './dto/create-house-room.dto';
import { UpdateHouseRoomDto } from './dto/update-house-room.dto';

@Injectable()
export class HouseRoomsService {
  create(createHouseRoomDto: CreateHouseRoomDto) {
    return 'This action adds a new houseRoom';
  }

  findAll() {
    return `This action returns all houseRooms`;
  }

  findOne(id: number) {
    return `This action returns a #${id} houseRoom`;
  }

  update(id: number, updateHouseRoomDto: UpdateHouseRoomDto) {
    return `This action updates a #${id} houseRoom`;
  }

  remove(id: number) {
    return `This action removes a #${id} houseRoom`;
  }
}

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
  createContract,
  CreateHouseDto,
  CreateHouseRoomDto,
  createRepairReply,
  HouseQuery,
} from './dto/create-land-lord.dto';
// import { UpdateLandLordDto } from './dto/update-land-lord.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  ResetPassword,
  SetPassword,
  UpdateMemberIdNum,
} from '../members/dto/create-member.dto';

@ApiTags('房东部分')
@Controller('/api/v1/land_lords')
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
    // console.log(req.user.id);
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

  @ApiOperation({
    summary: '房东设置密码',
  })
  @Put('ll_set_pwd')
  async landLordSetPwd(@Req() req, @Body() setPwd: SetPassword) {
    await this.landLordsService.landLordSetPwd(req.user.id, setPwd.password);
  }

  @ApiOperation({
    summary: '房东重置密码',
  })
  @Put('ll_reset_pwd')
  landLordResetPwd(@Req() req, @Body() resetPwd: ResetPassword) {
    return this.landLordsService.landLordResetPwd(
      req.user.id,
      resetPwd.password,
      resetPwd.code,
    );
  }

  @ApiOperation({
    summary: '房东实名认证',
  })
  @Put('ll_set_id_num')
  landLordSetUserIdNum(@Req() req, @Body() idNum: UpdateMemberIdNum) {
    return this.landLordsService.landLordSetIdNum(
      req.user.id,
      idNum.idNum,
      idNum.realName,
      idNum.avatar,
    );
  }

  @ApiOperation({
    summary: '生成合同',
  })
  @Post('init_contract')
  initContract(@Req() req, @Body() contract: createContract) {
    const { userMobile, ...data } = contract;

    return this.landLordsService.createContract(req.user.id, userMobile, data);
  }

  @ApiOperation({
    summary: '查看合同详情',
  })
  @Get('contract/:id')
  loadContractInfo(@Param('id') id: string) {
    return this.landLordsService.loadContractInfo(id);
  }

  @ApiOperation({
    summary: '终止合同',
  })
  @Delete('contract/:id')
  cancelContract(@Param('id') id: string, @Req() req) {
    return this.landLordsService.cancelContract(id, req.user.id);
  }

  @ApiOperation({
    summary: '用户信息',
  })
  @Get('/info')
  loadLLInfo(@Req() req) {
    return this.landLordsService.loadLandLordInfo(req.user.id);
  }

  @ApiOperation({
    summary: '有聊天记录的用户信息',
  })
  @Get('/messages')
  loadHasMessageUser(@Req() req) {
    return this.landLordsService.loadHasMessageUsers(req.user.id);
  }

  @ApiOperation({
    summary: '和指定人的聊天消息',
  })
  @Get('/messages/:id')
  async loadMessageWithUser(@Param('id') id: string, @Req() req) {
    const list = await this.landLordsService.loadMessageList(req.user.id, id);
    return list.reverse();
  }

  @ApiOperation({
    summary: '报修信息',
  })
  @Get('/repairs')
  loadRepairsInfo(@Req() req) {
    return this.landLordsService.loadRepairs(req.user.id);
  }

  @ApiOperation({
    summary: '预约看房信息',
  })
  @Get('/dates')
  loadDatesInfo(@Req() req) {
    return this.landLordsService.loadDates(req.user.id);
  }

  @Put('/replay_repairs/:id')
  replayRepairs(
    @Param('id') id: string,
    @Body() createRepairReplyDto: createRepairReply,
  ) {
    return this.landLordsService.replayRepairs(
      id,
      createRepairReplyDto.replyContent,
      createRepairReplyDto.replyImage,
    );
  }

  @ApiOperation({
    summary: '投诉信息',
  })
  @Get('/complains')
  loadComplainInfo(@Req() req) {
    return this.landLordsService.loadComplains(req.user.id);
  }
}

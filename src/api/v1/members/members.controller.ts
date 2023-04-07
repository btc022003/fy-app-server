import { Controller, Body, Put, Req } from '@nestjs/common';
import { MembersService } from './members.service';
import {
  CheckContract,
  DateHouseRoom,
  ResetPassword,
  RoomCollection,
  RoomRepairAskInfo,
  SetPassword,
  UpdateMemberIdNum,
} from './dto/create-member.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Get, Param, Post } from '@nestjs/common/decorators';

@ApiTags('客户端-会员中心')
@Controller('/api/v1/members')
export class MembersController {
  constructor(private readonly membersService: MembersService) {}

  @ApiOperation({
    summary: '设置密码',
  })
  @Put('set_pwd')
  async resetPwd(@Req() req, @Body() setPwd: SetPassword) {
    await this.membersService.setPwd(req.user.id, setPwd.password);
  }

  @ApiOperation({
    summary: '重置密码',
  })
  @Put('reset_pwd')
  setPwd(@Req() req, @Body() resetPwd: ResetPassword) {
    return this.membersService.resetPwd(
      req.user.id,
      resetPwd.password,
      resetPwd.code,
    );
  }

  @ApiOperation({
    summary: '实名认证',
  })
  @Put('set_id_num')
  setUserIdNum(@Req() req, @Body() idNum: UpdateMemberIdNum) {
    return this.membersService.setIdNum(
      req.user.id,
      idNum.idNum,
      idNum.realName,
      idNum.avatar,
    );
  }

  @ApiOperation({
    summary: '查看合同',
  })
  @Get('/view_contract')
  viewContract(@Req() req) {
    return this.membersService.loadUserContract(req.user.id);
  }

  @ApiOperation({
    summary: '确认合同',
  })
  @Post('/check_contract')
  checkContract(@Req() req, @Body() contractInfo: CheckContract) {
    return this.membersService.checkContract(
      req.user.id,
      contractInfo.contractId,
    );
  }

  @ApiOperation({
    summary: '获取合同账单',
  })
  @Get('/contract_orders/:id')
  contractOrders(@Req() req, @Param('id') id: string) {
    return this.membersService.loadOrders(id);
  }

  @ApiOperation({
    summary: '用户信息',
  })
  @Get('/info')
  loadLLInfo(@Req() req) {
    return this.membersService.loadUserInfo(req.user.id);
  }

  @ApiOperation({
    summary: '预约看房',
  })
  @Post('/date_room')
  dateHouseRoom(@Req() req, @Body() dateHouseRoom: DateHouseRoom) {
    dateHouseRoom.userId = req.user.id;
    return this.membersService.dateHouseRoom(dateHouseRoom);
  }

  @ApiOperation({
    summary: '获取用户的预约看房记录',
  })
  @Get('/date_rooms')
  loadDateRooms(@Req() req) {
    return this.membersService.loadDateHouseRooms(req.user.id);
  }

  @ApiOperation({
    summary: '报修',
  })
  @Post('/ask_repairs')
  askRepair(@Req() req, @Body() askInfo: RoomRepairAskInfo) {
    return this.membersService.repairsOrder(
      req.user.id,
      askInfo.askImage,
      askInfo.remarks,
    );
  }

  @ApiOperation({
    summary: '投诉',
  })
  @Post('/ask_complain')
  askComplain(@Req() req, @Body() askInfo: RoomRepairAskInfo) {
    return this.membersService.complain(
      req.user.id,
      askInfo.askImage,
      askInfo.remarks,
    );
  }

  @ApiOperation({
    summary: '收藏房源',
  })
  @Post('/toggle_collection')
  toggleCollection(@Req() req, @Body() collection: RoomCollection) {
    return this.membersService.toggleFav(
      req.user.id,
      collection.roomId,
      collection.remarks,
    );
  }

  @ApiOperation({
    summary: '有聊天记录的用户信息',
  })
  @Get('/messages')
  loadHasMessageUser(@Req() req) {
    return this.membersService.loadHasMessageUsers(req.user.id);
  }

  @ApiOperation({
    summary: '和指定人的聊天消息',
  })
  @Get('/messages/:id')
  async loadMessageWithUser(@Param('id') id: string, @Req() req) {
    const list = await this.membersService.loadMessageList(id, req.user.id);
    return list.reverse();
  }

  @ApiOperation({
    summary: '支付房租',
  })
  @Post('/pay_order_contract/:id')
  async payContractOrder(@Param('id') id: string) {
    return this.membersService.payContractOrder(id);
  }
}

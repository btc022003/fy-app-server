import { Controller, Body, Put, Req } from '@nestjs/common';
import { MembersService } from './members.service';
import {
  ResetPassword,
  SetPassword,
  UpdateMemberIdNum,
} from './dto/create-member.dto';
import { ApiOperation } from '@nestjs/swagger';

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
    );
  }

  @ApiOperation({
    summary: '房东设置密码',
  })
  @Put('ll_set_pwd')
  async landLordSetPwd(@Req() req, @Body() setPwd: SetPassword) {
    await this.membersService.setPwd(req.user.id, setPwd.password);
  }

  @ApiOperation({
    summary: '房东重置密码',
  })
  @Put('ll_reset_pwd')
  landLordResetPwd(@Req() req, @Body() resetPwd: ResetPassword) {
    return this.membersService.resetPwd(
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
    return this.membersService.setIdNum(
      req.user.id,
      idNum.idNum,
      idNum.realName,
    );
  }
}

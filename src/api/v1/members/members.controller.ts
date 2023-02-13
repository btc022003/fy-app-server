import { Controller, Body, Put, Req } from '@nestjs/common';
import { MembersService } from './members.service';
import {
  CheckContract,
  ResetPassword,
  SetPassword,
  UpdateMemberIdNum,
} from './dto/create-member.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Get, Post } from '@nestjs/common/decorators';

@ApiTags('一般用户会员中心')
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
    summary: '确认合同',
  })
  @Post('check_contract')
  checkContract(@Req() req, @Body() contractInfo: CheckContract) {
    return this.membersService.checkContract(
      req.user.id,
      contractInfo.contractId,
    );
  }

  @ApiOperation({
    summary: '用户信息',
  })
  @Get('/info')
  loadLLInfo(@Req() req) {
    return this.membersService.loadUserInfo(req.user.id);
  }
}

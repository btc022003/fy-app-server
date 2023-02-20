import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { CustomersService } from './customers.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('平台端-用户信息')
@Controller('/api/v1/admin/customers')
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  // @Post()
  // create(@Body() createCustomerDto: CreateCustomerDto) {
  //   return this.customersService.create(createCustomerDto);
  // }

  @ApiOperation({
    summary: '用户列表',
  })
  @Get()
  findAll() {
    return this.customersService.findAll();
  }

  @ApiOperation({
    summary: '客户预约看房记录',
  })
  @Get('/date_info/:id')
  findUserDateInfo(@Param('id') id: string) {
    return this.customersService.loadDateList(id);
  }

  @ApiOperation({
    summary: '客户合同记录',
  })
  @Get('/contract_info/:id')
  findUserContractInfo(@Param('id') id: string) {
    return this.customersService.loadContractList(id);
  }

  @ApiOperation({
    summary: '用户收藏记录',
  })
  @Get('/collections/:id')
  findUserCollections(@Param('id') id: string) {
    return this.customersService.loadCollections(id);
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.customersService.findOne(+id);
  // }

  // @Patch(':id')
  // update(
  //   @Param('id') id: string,
  //   @Body() updateCustomerDto: UpdateCustomerDto,
  // ) {
  //   return this.customersService.update(+id, updateCustomerDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.customersService.remove(+id);
  // }
}

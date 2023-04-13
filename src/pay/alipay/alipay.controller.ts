import {
  Controller,
  Get,
  Param,
  Post,
  Query,
  Render,
  Req,
} from '@nestjs/common';
import AlipaySdk from 'alipay-sdk';
import AliPayForm from 'alipay-sdk/lib/form';
import { readFileSync } from 'fs';
import { resolve } from 'path';
import { PrismaService } from 'src/prisma/prisma.service';
// console.log(resolve('./.key'));
// 普通公钥模式
const alipaySdk = new AlipaySdk({
  appId: '2016102400750271', // 商户号
  privateKey: readFileSync(resolve('./.key/alipay/private-key.pem'), 'ascii'), // 私钥
  gateway: 'https://openapi.alipaydev.com/gateway.do', // 测试时，沙箱地址。正式上线的时候可以删除此项目
  // 支付宝公钥，需要拿应用公钥去控制台兑换
  alipayPublicKey: readFileSync(
    resolve('./.key/alipay/alipay-public-key.pem'),
    'ascii',
  ), // 公钥
});

@Controller('/pay/alipay')
export class AlipayController {
  constructor(private readonly prisma: PrismaService) {}

  @Get('/pay/:id')
  @Render('pay/alipay')
  async getHello(@Param('id') id: string) {
    // return this.appService.getHello();
    // return {};
    const order = await this.prisma.roomContractOrder.findFirst({
      where: {
        id,
      },
    });
    // const order = await ;
    if (order) {
      const formData = new AliPayForm();
      formData.addField('notifyUrl', 'http://xx.com/pay/alipay/notify'); // 异步通知地址，上线之后进行修改
      formData.addField('returnUrl', 'http://xx.com/pay/alipay/pay_success'); // 同步回调地址
      formData.addField('bizContent', {
        productCode: 'QUICK_WAP_WAY',
        subject: '支付订单',
        totalAmount: 0.01, // 金额
        outTradeNo: order.id, // 系统订单号
        quit_url: '', //
      });
      let result: any = {};
      try {
        result = await alipaySdk.exec(
          'alipay.trade.wap.pay',
          {},
          {
            formData,
          },
        );
      } catch (err) {
        console.log(err);
      }
      // console.log(result);
      return { data: result };
    } else {
      return {};
    }
  }

  @Get('pay_success')
  @Render('/pay/alipay-success')
  async payReturn(@Query() query) {
    try {
      const { out_trade_no } = query;
      await this.prisma.roomContractOrder.update({
        data: {
          isPayed: true,
          payDate: new Date(),
        },
        where: {
          id: out_trade_no,
        },
      });
    } catch (err) {
      console.log(err);
    }

    return 'success';
  }

  @Post('notify')
  async paySuccessNotify(@Req() req) {
    const isValid = alipaySdk.checkNotifySign(req.body);
    if (isValid) {
      // req.body.out_trade_no 订单号，就是提交时传过去的，此处修改订单支付状态
      try {
        await this.prisma.roomContractOrder.update({
          data: {
            isPayed: true,
            payDate: new Date(),
          },
          where: {
            id: req.body.out_trade_no,
          },
        });
      } catch (err) {
        console.log(err);
      }

      return 'success';
    } else {
      return 'fail';
    }
  }
}

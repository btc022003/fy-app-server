import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { encodePwd, generateToken } from 'src/utils/tools';
import * as dayjs from 'dayjs';
import { RegDto } from './dto/create-auth.dto';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  /**
   *  根据名字获取数据
   * @param userName
   * @returns
   */
  async userByUserName(userName: string) {
    return this.prisma.user.findUnique({ where: { userName } });
  }

  /**
   * 用户注册
   * @param user
   * @returns
   */
  async userReg(user: RegDto) {
    const captcha = await this.prisma.captcha.findFirst({
      where: {
        mobile: user.userName,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    if (!captcha) {
      return {
        success: false,
        errorMessage: '请先获取验证码',
      };
    }

    const duration = dayjs().diff(dayjs(captcha.createdAt), 's');
    if (duration > 200) {
      return {
        success: false,
        errorMessage: '验证码已过期',
      };
    }

    if (captcha.code == user.pwd) {
      const isUser = await this.prisma.user.findFirst({
        where: {
          userName: user.userName,
        },
      });
      // 如果用户存在那就直接返回
      if (isUser) {
        return {
          success: true,
          errorMessage: '登陆成功',
          data: generateToken({ id: isUser.id }),
        };
      }
      const data = await this.prisma.user.create({
        data: {
          // ...user,
          userName: user.userName,
          password: encodePwd('fy001'),
        },
      });
      return {
        success: true,
        errorMessage: '注册成功',
        data: generateToken({ id: data.id }),
      };
    } else {
      return {
        success: false,
        errorMessage: '验证码错误',
      };
    }
  }

  /**
   * 登录
   * @param userName
   * @param password
   * @param type pwd/captcha
   * @returns
   */
  async userLogin(userName: string, password: string, type = 'pwd') {
    if (type == 'captcha') {
      const captcha = await this.prisma.captcha.findFirst({
        where: {
          mobile: userName,
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

      if (!captcha) {
        return {
          success: false,
          errorMessage: '请先获取验证码',
        };
      }

      const duration = dayjs().diff(dayjs(captcha.createdAt), 's');
      if (duration > 200) {
        return {
          success: false,
          errorMessage: '验证码已过期',
        };
      }
      const user = await this.prisma.user.findFirst({
        where: {
          userName,
        },
      });
      if (user) {
        if (password === captcha.code) {
          return {
            success: true,
            errorMessage: '登陆成功',
            data: generateToken({ id: user.id }),
          };
        } else {
          return {
            success: false,
            errorMessage: '验证码输入错误',
            data: '',
          };
        }
      }
      return {
        success: false,
        errorMessage: '用户信息不存在',
        data: '',
      };
    } else {
      const user = await this.prisma.user.findUnique({ where: { userName } });
      if (user) {
        const pwd = encodePwd(password);
        if (pwd == user.password) {
          return {
            success: true,
            errorMessage: '登陆成功',
            data: generateToken({ id: user.id }),
          };
        }
        return {
          success: false,
          errorMessage: '密码错误',
          data: '',
        };
      }
      return {
        success: false,
        errorMessage: '用户信息不存在',
        data: '',
      };
    }
  }

  /**
   * 管理后台登录
   * @param userName
   * @param password
   * @returns
   */
  async adminLogin(userName: string, password: string) {
    const user = await this.prisma.manager.findUnique({ where: { userName } });
    if (user) {
      const pwd = encodePwd(password);
      if (pwd == user.password) {
        return {
          success: true,
          errorMessage: '登陆成功',
          data: generateToken({ id: user.id }),
        };
      }
      return {
        success: false,
        errorMessage: '密码错误',
        data: '',
      };
    }
    return {
      success: false,
      errorMessage: '用户信息不存在',
      data: '',
    };
  }

  /**
   * 用户注册
   * @param user
   * @returns
   */
  async landLordReg(user: RegDto) {
    const captcha = await this.prisma.captcha.findFirst({
      where: {
        mobile: user.userName,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    if (!captcha) {
      return {
        success: false,
        errorMessage: '请先获取验证码',
      };
    }

    const duration = dayjs().diff(dayjs(captcha.createdAt), 's');
    if (duration > 200) {
      return {
        success: false,
        errorMessage: '验证码已过期',
      };
    }

    if (captcha.code == user.pwd) {
      const isUser = await this.prisma.landLord.findFirst({
        where: {
          userName: user.userName,
        },
      });
      // 如果用户存在那就直接返回
      if (isUser) {
        return {
          success: true,
          errorMessage: '登陆成功',
          data: generateToken({ id: isUser.id }),
        };
      }
      const data = await this.prisma.landLord.create({
        data: {
          // ...user,
          userName: user.userName,
          password: encodePwd('fy001'),
        },
      });
      return {
        success: true,
        errorMessage: '注册成功',
        data: generateToken({ id: data.id }),
      };
    } else {
      return {
        success: false,
        errorMessage: '验证码错误',
      };
    }
  }

  /**
   * 登录
   * @param userName
   * @param password
   * @param type pwd/captcha
   * @returns
   */
  async landLordLogin(userName: string, password: string, type = 'pwd') {
    if (type == 'captcha') {
      const captcha = await this.prisma.captcha.findFirst({
        where: {
          mobile: userName,
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

      if (!captcha) {
        return {
          success: false,
          errorMessage: '请先获取验证码',
        };
      }

      const duration = dayjs().diff(dayjs(captcha.createdAt), 's');
      if (duration > 200) {
        return {
          success: false,
          errorMessage: '验证码已过期',
        };
      }
      const user = await this.prisma.landLord.findFirst({
        where: {
          userName,
        },
      });
      if (user) {
        return {
          success: true,
          errorMessage: '登陆成功',
          data: generateToken({ id: user.id }),
        };
      }
      return {
        success: false,
        errorMessage: '用户信息不存在',
        data: '',
      };
    } else {
      const user = await this.prisma.landLord.findUnique({
        where: { userName },
      });
      if (user) {
        const pwd = encodePwd(password);
        if (pwd == user.password) {
          if (user.isChecked) {
            return {
              success: true,
              errorMessage: '登陆成功',
              data: generateToken({ id: user.id }),
            };
          }
          return {
            success: false,
            errorMessage: '等待系统审核',
            data: '',
          };
        }
        return {
          success: false,
          errorMessage: '密码错误',
          data: '',
        };
      }
      return {
        success: false,
        errorMessage: '用户信息不存在',
        data: '',
      };
    }
  }
}

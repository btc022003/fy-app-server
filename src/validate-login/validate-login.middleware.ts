import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { validateToken } from 'src/utils/tools';

@Injectable()
export class ValidateLoginMiddleware implements NestMiddleware {
  constructor(private readonly prisma: PrismaService) {}
  use(req: any, res: any, next: () => void) {
    // 暂时注释验证部分代码
    // console.log('验证登录');
    // next();
    // console.log(req.cookies?.token);
    // 在cookie和headers同时判断token
    const token = req.cookies?.token || req.headers.token;
    if (token) {
      // console.log(req.cookies.token);
      let user = null;
      validateToken(token, async (validateResult) => {
        if (validateResult.code) {
          const userId = validateResult.data.id;
          if (req.originalUrl.startsWith('/api/v1/admin')) {
            user = await this.prisma.manager.findUnique({
              where: { id: userId },
            });
          } else {
            user = await this.prisma.user.findUnique({
              where: { id: userId },
            });
            if (!user) {
              user = await this.prisma.landLord.findUnique({
                where: {
                  id: userId,
                },
              });
            }
          }
          // console.log(user);
          if (user) {
            req.user = user;
            next();
          } else {
            throw new UnauthorizedException();
          }
        } else {
          throw new UnauthorizedException();
        }
      });
    } else {
      throw new UnauthorizedException();
    }
  }
}

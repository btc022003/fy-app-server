import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';

@Injectable()
export class CustomerService {
  constructor(private prisma: PrismaService) {}
  // create(createCustomerDto: CreateCustomerDto) {
  //   return 'This action adds a new customer';
  // }

  // findAll() {
  //   return `This action returns all customer`;
  // }

  // findOne(id: number) {
  //   return `This action returns a #${id} customer`;
  // }

  // update(id: number, updateCustomerDto: UpdateCustomerDto) {
  //   return `This action updates a #${id} customer`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} customer`;
  // }
  /**
   * 获取公告
   * @param where
   * @param page
   * @param per
   * @returns
   */
  async loadNotices(where = {}, page = 1, per = 10) {
    page = isNaN(page) ? 1 : page * 1;
    per = isNaN(per) ? 10 : per * 1;

    const list = await this.prisma.notice.findMany({
      where,
      skip: (page - 1) * per,
      take: per * 1,
      // include,
      orderBy: {
        createdAt: 'desc',
      },
    });
    const total = await this.prisma.notice.count({ where });
    return {
      list,
      current: page,
      pageSize: per,
      total,
    };
  }

  /**
   * 获取文章分类
   * @returns
   */
  async loadArticleCategory() {
    // page = isNaN(page) ? 1 : page * 1;
    // per = isNaN(per) ? 10 : per * 1;

    // const list = await this.prisma.articleCategory.findMany({
    //   where,
    //   skip: (page - 1) * per,
    //   take: per * 1,
    //   // include,
    //   orderBy: {
    //     createdAt: 'desc',
    //   },
    // });
    // const total = await this.prisma.articleCategory.count({ where });
    // return {
    //   list,
    //   current: page,
    //   pageSize: per,
    //   total,
    // };
    return this.prisma.articleCategory.findMany({
      where: {},
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  /**
   * 获取文章
   * @param where
   * @param page
   * @param per
   * @returns
   */
  async loadArticles(where = {}, page = 1, per = 10) {
    page = isNaN(page) ? 1 : page * 1;
    per = isNaN(per) ? 10 : per * 1;

    const list = await this.prisma.article.findMany({
      where,
      skip: (page - 1) * per,
      take: per * 1,
      include: {
        category: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    const total = await this.prisma.article.count({ where });
    return {
      list,
      current: page,
      pageSize: per,
      total,
    };
  }

  /**
   * 根据id获取系统消息
   * @param id
   * @returns
   */
  async loadNotice(id: string) {
    return this.prisma.notice.findFirst({
      where: { id },
    });
  }

  /**
   * 根据id获取文章详情
   * @param id
   * @returns
   */
  async loadArticle(id: string) {
    return this.prisma.article.findFirst({
      where: { id },
      include: { category: true },
    });
  }
}

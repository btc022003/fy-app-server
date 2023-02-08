import { PrismaClient } from '@prisma/client';
import { encodePwd } from '../src/utils/tools';
const prisma = new PrismaClient();

async function main() {
  const admin = await prisma.manager.upsert({
    where: {
      userName: 'admin',
    },
    update: {
      password: encodePwd('admin'),
    },
    create: {
      userName: 'admin',
      password: encodePwd('admin'),
    },
  });
  // console.log(admin);
  const deviceCount = await prisma.roomDevice.count();
  if (deviceCount == 0) {
    await prisma.roomDevice.createMany({
      data: [
        {
          name: '热水器',
          image:
            'https://ke-image.ljcdn.com/rent-front-image/82e5b44b21844b608071ac426a5eb7e6.1524906411157_ae925a22-d95e-48bf-975c-447a27dd4ce9',
        },
        {
          name: '空调',
          image:
            'https://ke-image.ljcdn.com/rent-front-image/2c5080db6cb434413d39fe816faddafe.1524906138308_77f21b82-5983-4448-8348-ef9346263338',
        },
        {
          name: '床',
          image:
            'https://ke-image.ljcdn.com/rent-front-image/c40aee40a80ebcaa8d716a2c9ae14391.1524906024762_ac4fb64e-8467-46de-b6f5-7f9ba1ce2622',
        },
        {
          name: '洗衣机',
          image:
            'https://ke-image.ljcdn.com/rent-front-image/b45b25b8cbdbcbf1393999d1140d6729.1524906592660_dfa64012-e42c-4b11-a874-e2888e6dce4c',
        },
        {
          name: '卫生间',
          image: '',
        },
      ],
    });
  }
  console.log('数据初始化完成');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

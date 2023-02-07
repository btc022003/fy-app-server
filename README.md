# fy-app-server

## 说明

服务器端接口代码，运行方式

```bash
# 需要下载postgresql数据库
# 创建数据库fy-house-app
npm i
npx prisma db push
npx prisma db seed
npm run start:dev # 启动之后，在3000端口访问
```

[接口文档地址](http://localhost:3000/docs)

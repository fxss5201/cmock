const Koa = require("koa");
const chalk = require("chalk");
const path = require("path");
const fs = require("fs");
const bodyParser = require("koa-bodyparser");
const cors = require("koa2-cors");

const { port, proxy, mockFolder } = require("./package.json");
const global = require("./global.js").global;

const app = new Koa();

const fullpath = path.join(`${__dirname}\\${mockFolder}`);

// 判断文件夹是否存在，不存在则创建
fs.stat(`./${mockFolder}`, (err, stat) => {
  if (err) {
    fs.mkdirSync(`./${mockFolder}`, (ierr, istat) => {
      if (ierr) {
        console.log(chalk.red(`./${mockFolder} 文件夹不存在，并创建失败`));
      }
    });
  }

  const controller = require("./controller");

  // 全局公共变量及方法
  app.context.global = global;

  app.use(cors());

  // log request URL:
  app.use(async (ctx, next) => {
    console.log(
      chalk.blue(`Process ${ctx.request.method} ${ctx.request.url}...`)
    );
    await next();
  });

  if (process.env.create) {
    const { createProxyMiddleware } = require("http-proxy-middleware");
    const k2c = require("koa2-connect");
    const { onProxyReqFn, onProxyResFn } = require("./util/onProxy.js");

    proxy.forEach((item) => {
      // 创建 mock 文档
      app.use(async (ctx, next) => {
        if (ctx.url.startsWith(item.url)) {
          ctx.respond = false;
          await k2c(
            createProxyMiddleware({
              target: item.target,
              changeOrigin: true,
              onProxyReq: onProxyReqFn(fullpath),
              onProxyRes: onProxyResFn(fullpath),
            })
          )(ctx, next);
        }
        await next();
      });
    });

    // parse request body:
    app.use(bodyParser());
  } else {
    // parse request body:
    app.use(bodyParser());

    // add controllers:
    app.use(controller(mockFolder));
  }
});

app.listen(port);
console.log(chalk.green(`app started at port ${port}...`));

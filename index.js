const Koa = require("koa");
const chalk = require("chalk");
const path = require("path");
const fs = require("fs");
const bodyParser = require("koa-bodyparser");
const cors = require("koa2-cors");
const dayjs = require("dayjs");
const createSocketCmock = require("./util/socket");

const { port, proxy, mockFolder, language } = require("./package.json");
const languageObject = require(`./language/${language}.js`);
const { logInfo } = require("./util/common.js");
const global = require("./global.js").global;

const app = new Koa();

// 判断文件夹是否存在，不存在则创建
fs.stat(`./${mockFolder}`, (err, stat) => {
  if (err) {
    fs.mkdirSync(`./${mockFolder}`, (ierr, istat) => {
      if (ierr) {
        console.log(chalk.red(`./${mockFolder} 文件夹不存在，创建失败`));
      }
    });
  }

  // 全局公共变量及方法
  app.context.global = global;

  app.use(cors());

  // 接口访问是打印
  app.use(async (ctx, next) => {
    console.log(
      logInfo,
      chalk.blue(
        `${languageObject.allConsole} ${chalk.yellow(ctx.request.method)} ${
          ctx.request.url
        }`
      ),
      dayjs().format("YYYY-MM-DD HH:mm:ss")
    );
    await next();
  });

  // cross-env 设置环境变量 create ，以此来区分是否用于创建 mock 文件
  if (process.env.create) {
    const { createProxyMiddleware } = require("http-proxy-middleware");
    const k2c = require("koa2-connect");
    const { onProxyReqFn, onProxyResFn } = require("./util/onProxy.js");

    // 配置多个代理
    proxy.forEach((item) => {
      app.use(async (ctx, next) => {
        if (ctx.url.startsWith(item.url)) {
          ctx.respond = false;
          await k2c(
            createProxyMiddleware({
              target: item.target,
              changeOrigin: true,
              onProxyReq: onProxyReqFn(),
              onProxyRes: onProxyResFn(),
            })
          )(ctx, next);
        }
        await next();
      });
    });

    // parse request body:
    app.use(bodyParser());
  } else {
    const controller = require("./controller");

    // parse request body:
    app.use(bodyParser());

    // add mocks:
    app.use(controller());

    createSocketCmock();
  }
});

app.listen(port);
console.log(chalk.green(`app started at port ${port}...`));

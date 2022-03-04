// https://github.com/michaelliao/learn-javascript/blob/master/samples/node/web/koa/url2-koa/controller.js

const fs = require("fs");
const path = require("path");
const chalk = require("chalk");
const Mock = require("mockjs");
const { needParams, timeout } = require("./package.json");
const objectToString = require("./util/objectToString.js");

/**
 * addMocks
 * @param {Object} router require('koa-router')()
 * @param {String} dir path
 */
function addMocks(router, dir) {
  const fullpath = path.join(__dirname + "/" + dir);
  listFile(router, fullpath);
}

/**
 * 便利 mock 文件目录
 * @param {Object} router require('koa-router')()
 * @param {String} dirPath path
 */
function listFile(router, dirPath) {
  const arr = fs.readdirSync(dirPath);
  arr.forEach(function (item) {
    const fullpath = path.join(dirPath, item);
    console.log(chalk.blue(`process controller: ${fullpath}...`));
    const fileContent = require(fullpath);
    addRouters(router, fileContent);
  });
}

/**
 * add url-route in /mocks:
 * @param {Object} router require('koa-router')()
 * @param {Object} fileContent require(__dirname + '/' + dir + '/' + f)
 */
function addRouters(router, fileContent) {
  if (fileContent.method.toLowerCase() === "get") {
    router.get(fileContent.url, createRouter(fileContent));
    // 用于打印注册号接口的信息
    console.log(
      chalk.green(
        `register URL: ${chalk.white(fileContent.name)}： ${chalk.yellow(
          "get"
        )} ${fileContent.url}`
      )
    );
  } else if (fileContent.method.toLowerCase() === "post") {
    router.post(fileContent.url, createRouter(fileContent));
    // 用于打印注册号接口的信息
    console.log(
      chalk.green(
        `register URL: ${chalk.white(fileContent.name)}： ${chalk.yellow(
          "post"
        )} ${fileContent.url}`
      )
    );
  } else if (fileContent.method.toLowerCase() === "put") {
    router.put(fileContent.url, createRouter(fileContent));
    // 用于打印注册号接口的信息
    console.log(
      chalk.green(
        `register URL: ${chalk.white(fileContent.name)}： ${chalk.yellow(
          "put"
        )} ${fileContent.url}`
      )
    );
  } else if (fileContent.method.toLowerCase() === "delete") {
    router.del(fileContent.url, createRouter(fileContent));
    // 用于打印注册号接口的信息
    console.log(
      chalk.green(
        `register URL: ${chalk.white(fileContent.name)}： ${chalk.yellow(
          "delete"
        )} ${fileContent.url}`
      )
    );
  } else {
    console.log(chalk.red(`invalid URL: ${fileContent.url}`));
  }
}

/**
 * 生成路由函数
 * @param {Object} fileContent 对应 mock 文件导出的对象
 */
function createRouter(fileContent) {
  return async (ctx, next) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (!fileContent.isUseMockjs) {
          // 收集请求参数，得出 body 中的参数 key
          let paramsBody = Object.assign(
            {},
            ctx.params,
            ctx.query,
            ctx.request.body
          );
          let paramsKeyList = Object.keys(paramsBody);
          let needParamsKeys = [];
          let bodyKey = "default";
          paramsKeyList.forEach((item) => {
            if (needParams.includes(item)) {
              needParamsKeys.push(item);
            }
          });
          if (needParamsKeys.length) {
            bodyKey = objectToString(paramsBody, needParamsKeys);
          }
          // 判断 mock 文件的 body 中是否存在请求参数 key，如果不存在，则默认引用第一个
          const mappingBodyKeys = Object.keys(fileContent.body);
          if (!mappingBodyKeys.includes(bodyKey) && mappingBodyKeys.length) {
            bodyKey = mappingBodyKeys[0];
          }

          ctx.response.type = fileContent.type;
          ctx.response.body = fileContent.body[bodyKey];
        } else {
          ctx.response.body = Mock.mock(fileContent.body.mockTemplate);
        }
        resolve();
      }, fileContent.timeout || timeout || 0);
    });
    next();
  };
}

module.exports = function (dir) {
  const mocks_dir = dir || "mocks";
  const router = require("koa-router")();
  addMocks(router, mocks_dir);
  return router.routes();
};

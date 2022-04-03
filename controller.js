// https://github.com/michaelliao/learn-javascript/blob/master/samples/node/web/koa/url2-koa/controller.js

const fs = require("fs");
const path = require("path");
const chalk = require("chalk");
const Mock = require("mockjs");
const { needParams, timeout, language } = require("./package.json");
const objectToString = require("./util/objectToString.js");
const { logInfo, logSuccess, logError } = require("./util/common.js");
const { mockFolder } = require("./package.json");
const languageObject = require(`./language/${language}.js`);

/**
 * addMocks
 * @param {Object} router require('koa-router')()
 */
function addMocks(router) {
  const fullpath = path.join(process.cwd(), mockFolder);
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
    console.log(
      logInfo,
      chalk.blue(`${languageObject.controllerMockFile} ${fullpath}`)
    );
    const fileContent = require(fullpath);
    addRouters(router, fileContent, fullpath);
  });
}

/**
 * add url-route in /mocks:
 * @param {Object} router require('koa-router')()
 * @param {Object} fileContent path.join(process.cwd(), mockFolder, file)
 * @param {String} dirPath path
 */
function addRouters(router, fileContent, dirPath) {
  if (fileContent.method.toLowerCase() === "get") {
    router.get(fileContent.url, createRouter(fileContent, dirPath));
    // 用于打印注册号接口的信息
    console.log(
      logSuccess,
      chalk.green(
        `${languageObject.controllerRegister} ${chalk.white(
          fileContent.name
        )}: ${chalk.yellow("get")} ${fileContent.url}`
      )
    );
  } else if (fileContent.method.toLowerCase() === "post") {
    router.post(fileContent.url, createRouter(fileContent, dirPath));
    // 用于打印注册号接口的信息
    console.log(
      logSuccess,
      chalk.green(
        `${languageObject.controllerRegister} ${chalk.white(
          fileContent.name
        )}: ${chalk.yellow("post")} ${fileContent.url}`
      )
    );
  } else if (fileContent.method.toLowerCase() === "put") {
    router.put(fileContent.url, createRouter(fileContent, dirPath));
    // 用于打印注册号接口的信息
    console.log(
      logSuccess,
      chalk.green(
        `${languageObject.controllerRegister} ${chalk.white(
          fileContent.name
        )}: ${chalk.yellow("put")} ${fileContent.url}`
      )
    );
  } else if (fileContent.method.toLowerCase() === "delete") {
    router.del(fileContent.url, createRouter(fileContent, dirPath));
    // 用于打印注册号接口的信息
    console.log(
      logSuccess,
      chalk.green(
        `${languageObject.controllerRegister} ${chalk.white(
          fileContent.name
        )}: ${chalk.yellow("delete")} ${fileContent.url}`
      )
    );
  } else {
    console.log(
      logError,
      chalk.red(`${languageObject.controllerMockFileError}`),
      chalk.red(dirPath)
    );
  }
}

/**
 * 生成路由函数
 * @param {Object} fileContent 对应 mock 文件导出的对象
 * @param {String} dirPath path
 */
function createRouter(fileContent, dirPath) {
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
            if (needParams.length && needParams.includes(item)) {
              needParamsKeys.push(item);
            } else {
              needParamsKeys.push(item);
            }
          });
          if (needParamsKeys.length) {
            bodyKey = objectToString(paramsBody, needParamsKeys);
          }
          // 判断 mock 文件的 body 中是否存在请求参数 key，如果不存在，则默认引用第一个（需判断第一个是否是 mockTemplate ）
          let fileBodyKeys = Object.keys(fileContent.body);
          fileBodyKeys = fileBodyKeys.filter((x) => x !== "mockTemplate");
          if (fileBodyKeys.length) {
            if (!fileBodyKeys.includes(bodyKey)) {
              bodyKey = fileBodyKeys[0];
            }
            ctx.response.body = fileContent.body[bodyKey];
          } else {
            ctx.response.body = {
              message: `${languageObject.controllerMockFileBody} ${dirPath}`,
            };
            console.log(
              logError,
              chalk.red(`${languageObject.controllerMockFileBody}`),
              chalk.red(dirPath)
            );
          }

          ctx.response.type = fileContent.type;
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
  const router = require("koa-router")();
  addMocks(router);
  return router.routes();
};

// https://github.com/michaelliao/learn-javascript/blob/master/samples/node/web/koa/url2-koa/controller.js

const fs = require("fs");
const path = require("path");
const chalk = require("chalk");
const { needParams } = require("./package.json");
const objectToString = require("./util/objectToString.js");

/**
 * addControllers
 * @param {Object} router require('koa-router')()
 * @param {String} dir path
 */
function addControllers(router, dir) {
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
    const mapping = require(fullpath);
    addMapping(router, mapping);
  });
}

/**
 * add url-route in /controllers:
 * @param {Object} router require('koa-router')()
 * @param {Object} mapping require(__dirname + '/' + dir + '/' + f)
 */
function addMapping(router, mapping) {
  if (mapping.method.toLowerCase() === "get") {
    router.get(mapping.url, createRouter(mapping));
    // 用于打印注册号接口的信息
    console.log(
      chalk.green(
        `register URL mapping: ${chalk.white(mapping.name)}： ${chalk.yellow(
          "get"
        )} ${mapping.url}`
      )
    );
  } else if (mapping.method.toLowerCase() === "post") {
    router.post(mapping.url, createRouter(mapping));
    // 用于打印注册号接口的信息
    console.log(
      chalk.green(
        `register URL mapping: ${chalk.white(mapping.name)}： ${chalk.yellow(
          "post"
        )} ${mapping.url}`
      )
    );
  } else if (mapping.method.toLowerCase() === "put") {
    router.put(mapping.url, createRouter(mapping));
    // 用于打印注册号接口的信息
    console.log(
      chalk.green(
        `register URL mapping: ${chalk.white(mapping.name)}： ${chalk.yellow(
          "put"
        )} ${mapping.url}`
      )
    );
  } else if (mapping.method.toLowerCase() === "delete") {
    router.del(mapping.url, createRouter(mapping));
    // 用于打印注册号接口的信息
    console.log(
      chalk.green(
        `register URL mapping: ${chalk.white(mapping.name)}： ${chalk.yellow(
          "delete"
        )} ${mapping.url}`
      )
    );
  } else {
    console.log(chalk.red(`invalid URL: ${mapping.url}`));
  }
}

/**
 * 生成路由函数
 * @param {Object} mapping 对应 mock 文件导出的对象
 */
function createRouter(mapping) {
  return async (ctx, next) => {
    // 收集请求参数，得出 body 中的参数 key
    let paramsBody = Object.assign({}, ctx.params, ctx.query, ctx.request.body);
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
    const mappingBodyKeys = Object.keys(mapping.body);
    if (!mappingBodyKeys.includes(bodyKey) && mappingBodyKeys.length) {
      bodyKey = mappingBodyKeys[0];
    }

    ctx.response.type = mapping.type;
    ctx.response.body = mapping.body[bodyKey];
    next();
  };
}

module.exports = function (dir) {
  const controllers_dir = dir || "controllers";
  const router = require("koa-router")();
  addControllers(router, controllers_dir);
  return router.routes();
};

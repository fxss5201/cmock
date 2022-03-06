const fs = require("fs");
const path = require("path");
const chalk = require("chalk");
const qs = require("qs");
const dayjs = require("dayjs");
const replaceAll = require("./replaceAll.js");
const template = require("./template.js").template;
const { mockFolder, needParams, language } = require("../package.json");
const objectToString = require("./objectToString.js");
const { logSuccess, logError } = require("./common.js");
const languageObject = require(`../language/${language}.js`);

// https://github.com/chimurai/http-proxy-middleware#http-proxy-events
function onProxyReqFn() {
  return function (proxyReq, req, res) {
    // 生成特殊标识，并 setHeader ，保证同一请求多次触发时能正确匹配
    let headerFlag = `headerFlag${parseInt(Math.random() * 100000000000)}`;
    proxyReq.setHeader("headerFlag", headerFlag);
    // 接口请求链接转换为文件名
    const requestUrl = `${replaceAll("/", "_", req.url)}`;
    let fileName = requestUrl;
    let url = req.url;
    // get请求特殊处理
    if (req.method.toLowerCase() === "get" || fileName.indexOf("?") > -1) {
      fileName = requestUrl.split("?")[0];
      url = url.split("?")[0];
    }

    let fileContent;
    let fileNameUrl = path.join(process.cwd(), mockFolder, `${fileName}.js`);
    // 直接 require 对应的 mock 文件，如果失败则同步创建再 require
    try {
      fileContent = require(fileNameUrl);
    } catch (error) {
      let fileTemplate = template;
      let updateTime = dayjs().format("YYYY-MM-DD HH:mm:ss");

      fileTemplate = fileTemplate.replace("$url", url);
      fileTemplate = fileTemplate.replace("$method", req.method);
      fileTemplate = fileTemplate.replace("$type", req.headers.accept);
      fileTemplate = fileTemplate.replace("$createTime", updateTime);
      fileTemplate = fileTemplate.replace("$updateTime", updateTime);

      // http://nodejs.cn/api/fs.html#fsappendfilesyncpath-data-options
      fs.appendFileSync(fileNameUrl, fileTemplate);
      console.log(
        logSuccess,
        chalk.green(fileNameUrl),
        chalk.green(`${languageObject.proxyCreateSuccess}`)
      );
      fileContent = require(fileNameUrl);
    }

    if (req.method.toLowerCase() !== "get") {
      // 非 get 请求时，请求参数获取
      let body = [];
      req.on("data", function (chunk) {
        body.push(chunk);
      });
      req.on("end", function () {
        // 获取到请求参数并转化为对应的参数 key
        body = Buffer.concat(body).toString();
        const paramsBody = body && JSON.parse(body);
        let paramsKeyList = Object.keys(paramsBody);
        let needParamsKeys = [];
        let bodyKey = "";
        paramsKeyList.forEach((item) => {
          if (needParams.includes(item)) {
            needParamsKeys.push(item);
          }
        });
        if (needParamsKeys.length) {
          bodyKey = objectToString(paramsBody, needParamsKeys);
        }
        if (bodyKey.length) {
          fileContent.body[bodyKey] = "";
        } else {
          fileContent.body.default = "";
        }
        fileContent.bodyKey[headerFlag] = bodyKey;

        // 将参数 key 一并写入 mock 文件
        fileContent = `module.exports=${JSON.stringify(fileContent)}`;
        fs.writeFile(fileNameUrl, fileContent, (err) => {
          if (err)
            console.log(
              logError,
              chalk.red(`onProxyReqFn: `),
              chalk.red(fileNameUrl),
              chalk.red(err)
            );
          console.log(
            logSuccess,
            chalk.green(`onProxyReqFn: `),
            chalk.green(fileNameUrl),
            chalk.green(`${languageObject.proxySaveSuccess}`)
          );
        });
      });
    } else {
      // get 请求直接从 url 上获取参数，并使用 qs 将参数字符串转化为对象，之后得到 body 中的参数 key
      const paramsBody = qs.parse(requestUrl.split("?")[1]);
      let paramsKeyList = Object.keys(paramsBody);
      let needParamsKeys = [];
      let bodyKey = "";
      paramsKeyList.forEach((item) => {
        if (needParams.includes(item)) {
          needParamsKeys.push(item);
        }
      });
      if (needParamsKeys.length) {
        bodyKey = objectToString(paramsBody, needParamsKeys);
      }
      if (bodyKey.length) {
        fileContent.body[bodyKey] = "";
      } else {
        fileContent.body.default = "";
      }
      fileContent.bodyKey[headerFlag] = bodyKey;

      // 将参数 key 一并写入 mock 文件
      fileContent = `module.exports=${JSON.stringify(fileContent)}`;
      fs.writeFile(fileNameUrl, fileContent, (err) => {
        if (err)
          console.log(
            logError,
            chalk.red(`onProxyReqFn: `),
            chalk.red(fileNameUrl),
            chalk.red(err)
          );
        console.log(
          logSuccess,
          chalk.green(`onProxyReqFn: `),
          chalk.green(fileNameUrl),
          chalk.green(`${languageObject.proxySaveSuccess}`)
        );
      });
    }
  };
}

function onProxyResFn() {
  return function (proxyRes, req, res) {
    // 获取 onProxyReqFn 中设置的标识
    let headerFlag = proxyRes.req._header.match(/(?<=headerFlag: )(.*)\r\n/)[1];

    // 根据 url 获取 mock 文件名
    const requestUrl = `${replaceAll("/", "_", req.url)}`;
    let fileName = requestUrl;
    if (req.method.toLowerCase() === "get" || fileName.indexOf("?") > -1) {
      fileName = requestUrl.split("?")[0];
    }

    let fileNameUrl = path.join(process.cwd(), mockFolder, `${fileName}.js`);
    let fileContent = require(fileNameUrl);
    // 导入 mock 文件对象，并根据 headerFlag 拿到 body 中的参数 key
    let key = fileContent.bodyKey[headerFlag] || "default";
    delete fileContent.bodyKey[headerFlag];

    // 获取后端接口返回的数据结构
    let body = [];
    proxyRes.on("data", function (chunk) {
      body.push(chunk);
    });
    proxyRes.on("end", function () {
      body = Buffer.concat(body).toString();

      // 将后端接口返回的数据结构添加到 mock 文件的导出对象中
      if (!fileContent.body[key]) {
        fileContent.body[key] = body ? JSON.parse(body) : "";
      }

      // 更新时间
      fileContent.updateTime = dayjs().format("YYYY-MM-DD HH:mm:ss");

      // 重新写入 mock 完整文件
      fileContent = `module.exports=${JSON.stringify(fileContent)}`;
      fs.writeFile(fileNameUrl, fileContent, (err) => {
        if (err)
          console.log(
            logError,
            chalk.red(`onProxyResFn: `),
            chalk.red(fileNameUrl),
            chalk.red(err)
          );
        console.log(
          logSuccess,
          chalk.green(`onProxyResFn: `),
          chalk.green(fileNameUrl),
          chalk.green(`${languageObject.proxySaveSuccess}`)
        );
      });
      res.end();
    });
  };
}

module.exports = {
  onProxyReqFn,
  onProxyResFn,
};

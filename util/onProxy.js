const fs = require("fs");
const chalk = require("chalk");
const qs = require("qs");
const dayjs = require("dayjs");
const replaceAll = require("./replaceAll.js");
const template = require("./template.js").template;
const { mockFolder, needParams } = require("../package.json");
const objectToString = require("./objectToString.js");

// https://github.com/chimurai/http-proxy-middleware#http-proxy-events
function onProxyReqFn(fullpath) {
  return function (proxyReq, req, res) {
    // 生成特殊标识，并 setHeader ，保证同一请求多次触发时能正确匹配
    let headerFlag = `headerFlag${parseInt(Math.random() * 100000000000)}`;
    proxyReq.setHeader("headerFlag", headerFlag);
    // 接口请求链接转换为文件名
    const fileNameUrl = `${replaceAll("/", "_", req.url)}`;
    let fileName = fileNameUrl;
    let url = req.url;
    // get请求特殊处理
    if (req.method.toLowerCase() === "get" || fileName.indexOf("?") > -1) {
      fileName = fileNameUrl.split("?")[0];
      url = url.split("?")[0];
    }

    let fileText;
    // 直接 require 对应的 mock 文件，如果失败则同步创建再 require
    try {
      fileText = require(`${fullpath}/${fileName}.js`);
    } catch (error) {
      let fileTemplate = template;
      let updateTime = dayjs().format("YYYY-MM-DD HH:mm:ss");

      fileTemplate = fileTemplate.replace("$url", url);
      fileTemplate = fileTemplate.replace("$method", req.method);
      fileTemplate = fileTemplate.replace("$type", req.headers.accept);
      fileTemplate = fileTemplate.replace("$createTime", updateTime);
      fileTemplate = fileTemplate.replace("$updateTime", updateTime);

      // http://nodejs.cn/api/fs.html#fsappendfilesyncpath-data-options
      fs.appendFileSync(`./${mockFolder}/${fileName}.js`, fileTemplate);
      console.log(chalk.green(`onProxyReqFn: ${fileName}.js create success`));
      fileText = require(`${fullpath}/${fileName}.js`);
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
          fileText.body[bodyKey] = "";
        } else {
          fileText.body.default = "";
        }
        fileText.bodyKey[headerFlag] = bodyKey;

        // 将参数 key 一并写入 mock 文件
        fileText = `module.exports=${JSON.stringify(fileText)}`;
        fs.writeFile(`${fullpath}\\${fileName}.js`, fileText, (err) => {
          if (err)
            console.log(chalk.red(`onProxyReqFn: ${fileName}.js ${err}`));
          console.log(chalk.green(`onProxyReqFn: ${fileName}.js save success`));
        });
      });
    } else {
      // get 请求直接从 url 上获取参数，并使用 qs 将参数字符串转化为对象，之后得到 body 中的参数 key
      const paramsBody = qs.parse(fileNameUrl.split("?")[1]);
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
        fileText.body[bodyKey] = "";
      } else {
        fileText.body.default = "";
      }
      fileText.bodyKey[headerFlag] = bodyKey;

      // 将参数 key 一并写入 mock 文件
      fileText = `module.exports=${JSON.stringify(fileText)}`;
      fs.writeFile(`${fullpath}\\${fileName}.js`, fileText, (err) => {
        if (err) console.log(chalk.red(`onProxyReqFn: ${fileName}.js ${err}`));
        console.log(chalk.green(`onProxyReqFn: ${fileName}.js save success`));
      });
    }
  };
}

function onProxyResFn(fullpath) {
  return function (proxyRes, req, res) {
    // 获取 onProxyReqFn 中设置的标识
    let headerFlag = proxyRes.req._header.match(/(?<=headerFlag: )(.*)\r\n/)[1];

    // 根据 url 获取 mock 文件名
    const fileNameUrl = `${replaceAll("/", "_", req.url)}`;
    let fileName = fileNameUrl;
    if (req.method.toLowerCase() === "get" || fileName.indexOf("?") > -1) {
      fileName = fileNameUrl.split("?")[0];
    }

    // 导入 mock 文件对象，并根据 headerFlag 拿到 body 中的参数 key
    let fileText = require(`${fullpath}/${fileName}.js`);
    let key = fileText.bodyKey[headerFlag] || "default";
    delete fileText.bodyKey[headerFlag];

    // 获取后端接口返回的数据结构
    let body = [];
    proxyRes.on("data", function (chunk) {
      body.push(chunk);
    });
    proxyRes.on("end", function () {
      body = Buffer.concat(body).toString();

      // 将后端接口返回的数据结构添加到 mock 文件的导出对象中
      if (!fileText.body[key]) {
        fileText.body[key] = body ? JSON.parse(body) : "";
      }

      // 更新时间
      fileText.updateTime = dayjs().format("YYYY-MM-DD HH:mm:ss");

      // 重新写入 mock 完整文件
      fileText = `module.exports=${JSON.stringify(fileText)}`;
      fs.writeFile(`${fullpath}\\${fileName}.js`, fileText, (err) => {
        if (err) console.log(chalk.red(`onProxyResFn: ${fileName}.js ${err}`));
        console.log(chalk.green(`onProxyResFn: ${fileName}.js save success`));
      });
      res.end();
    });
  };
}

module.exports = {
  onProxyReqFn,
  onProxyResFn,
};

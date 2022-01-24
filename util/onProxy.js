const fs = require("fs");
const chalk = require("chalk");
const qs = require("qs");
const dayjs = require("dayjs");
const replaceAll = require("./replaceAll.js");
const template = require("./template.js").template;
const { mockFolder, needParams } = require("../package.json");
const objectToString = require("./objectToString.js");

function onProxyReqFn(fullpath) {
  return function (proxyReq, req, res) {
    let headerFlag = `headerFlag${parseInt(Math.random() * 100000000000)}`;
    proxyReq.setHeader("headerFlag", headerFlag);

    let fileTemplate = template;

    const fileNameUrl = `${replaceAll("/", "_", req.url)}`;
    let fileName = fileNameUrl;
    let url = req.url;
    if (req.method.toLowerCase() === "get") {
      fileName = fileNameUrl.split("?")[0];
      url = url.split("?")[0];
    }
    let updateTime = dayjs().format("YYYY-MM-DD HH:mm:ss");

    fileTemplate = fileTemplate.replace("$url", url);
    fileTemplate = fileTemplate.replace("$method", req.method);
    fileTemplate = fileTemplate.replace("$type", req.headers.accept);

    let fileText;
    try {
      fileText = require(`${fullpath}/${fileName}.js`);
    } catch (error) {
      fileTemplate = fileTemplate.replace("$createTime", updateTime);
      fileTemplate = fileTemplate.replace("$updateTime", updateTime);
      fs.appendFileSync(`./${mockFolder}/${fileName}.js`, fileTemplate);
      console.log(chalk.green(`onProxyReqFn: ${fileName}.js create success`));
      fileText = require(`${fullpath}/${fileName}.js`);
    }

    if (req.method.toLowerCase() !== "get") {
      let body = [];
      req.on("data", function (chunk) {
        body.push(chunk);
      });
      req.on("end", function () {
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

        fileText = `module.exports=${JSON.stringify(fileText)}`;
        fs.writeFile(`${fullpath}\\${fileName}.js`, fileText, (err) => {
          if (err)
            console.log(chalk.red(`onProxyReqFn: ${fileName}.js ${err}`));
          console.log(chalk.green(`onProxyReqFn: ${fileName}.js save success`));
        });
      });
    } else {
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
    // 获取 onProxyReqFn 中的 标识
    let headerFlag = proxyRes.req._header.match(/(?<=headerFlag: )(.*)\r\n/)[1];

    const fileNameUrl = `${replaceAll("/", "_", req.url)}`;
    let fileName = fileNameUrl;
    if (req.method.toLowerCase() === "get") {
      fileName = fileNameUrl.split("?")[0];
    }

    let fileText = require(`${fullpath}/${fileName}.js`);
    let key = fileText.bodyKey[headerFlag] || "default";
    delete fileText.bodyKey[headerFlag];

    let body = [];
    proxyRes.on("data", function (chunk) {
      body.push(chunk);
    });
    proxyRes.on("end", function () {
      body = Buffer.concat(body).toString();
      if (!fileText.body[key]) {
        fileText.body[key] = JSON.parse(body);
      }
      fileText.updateTime = dayjs().format("YYYY-MM-DD HH:mm:ss");
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

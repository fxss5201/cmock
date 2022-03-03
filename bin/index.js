#!/usr/bin/env node

const program = require("commander");
const inquirer = require("inquirer");
const chalk = require("chalk");
const fs = require("fs");
const dayjs = require("dayjs");
const replaceAll = require("./../util/replaceAll");
const { mockFolder } = require("../package.json");

program
  .version("1.0.0", "-v, --version")
  .command("add")
  .action(() => {
    inquirer
      .prompt([
        {
          name: "url",
          type: "input",
          message: "请输入接口路径：",
          validate: (value) => {
            if (value === "") {
              console.log(chalk.red("✖"), chalk.red("请输入接口路径"));
              return false;
            }
            const fileNameUrl = `./../${mockFolder}/${replaceAll(
              "/",
              "_",
              value
            )}.js`;

            try {
              const mockFileExport = require(fileNameUrl);
              if (mockFileExport) {
                console.log(chalk.red("✖"), chalk.red("mock文件已存在"));
                return false;
              }
            } catch (err) {
              return true;
            }
          },
        },
        {
          name: "name",
          type: "input",
          message: "请输入接口名称：",
        },
        {
          name: "method",
          type: "list",
          message: "请选择接口方法：",
          choices: ["get", "post", "put", "delete"],
          default: "post",
        },
        {
          name: "type",
          type: "list",
          message: "请选择接口的response.type：",
          choices: ["application/json", "text/plain"],
          default: "application/json",
        },
        {
          name: "isUseMockjs",
          type: "confirm",
          message: "是否使用mockjs？：",
          default: false,
        },
        {
          name: "timeout",
          type: "number",
          message: "请输入接口timeout：",
          validate: (value) => {
            if (!/^[0-9]*$/.test(value)) {
              console.log(chalk.red("✖"), chalk.red("请输入 >= 0 的数字"));
              return false;
            }
            return true;
          },
          default: 0,
        },
        // {
        //   name: "body",
        //   type: "editor",
        //   message: "请输入接口数据结构：",
        //   postfix: "Powershell",
        //   validate: (value) => {
        //     if (!value) {
        //       console.log(chalk.red("✖"), chalk.red("请输入接口数据结构"));
        //       return false;
        //     }
        //     return true;
        //   },
        // },
      ])
      .then((answers) => {
        let template = {
          name: "$name",
          url: "$url",
          method: "$method",
          type: "$type",
          createTime: "$createTime",
          updateTime: "$updateTime",
          isUseMockjs: false,
          timeout: 0,
          bodyKey: {},
          body: {},
        };

        // console.log(answers.body);
        // 通过临时文件拿到的 answers.body 暂时有问题
        // if (answers.isUseMockjs) {
        //   template.body.mockTemplate = answers.body;
        // } else {
        //   template.body.default = answers.body;
        // }
        // delete answers.body;
        if (answers.isUseMockjs) {
          template.body.mockTemplate = {};
        } else {
          template.body.default = {};
        }
        let fileContent = {
          ...template,
          ...answers,
          createTime: dayjs().format("YYYY-MM-DD HH:mm:ss"),
          updateTime: dayjs().format("YYYY-MM-DD HH:mm:ss"),
        };

        const fileNameUrl = `${process.cwd()}\\${mockFolder}\\${replaceAll(
          "/",
          "_",
          answers.url
        )}.js`;
        fs.appendFileSync(
          fileNameUrl,
          `module.exports = ${JSON.stringify(fileContent, null, "\t")}`
        );
      });
  });

program.command("delete").action(() => {
  inquirer
    .prompt([
      {
        name: "flag",
        type: "confirm",
        message: "文件名是否由接口url转换的？",
      },
      {
        name: "url",
        type: "input",
        message: "请输入接口路径：",
        when: (answers) => {
          return answers.flag;
        },
        validate: (value) => {
          if (value === "") {
            console.log(chalk.red("✖"), chalk.red("请输入接口路径："));
            return false;
          }
          const fileNameUrl = `./../${mockFolder}/${replaceAll(
            "/",
            "_",
            value
          )}.js`;
          try {
            const mockFileExport = require(fileNameUrl);
            if (mockFileExport) {
              return true;
            }
          } catch (err) {
            console.log(
              chalk.red("✖"),
              chalk.red(`mock文件：${replaceAll("/", "_", value)}.js 不存在`)
            );
            return false;
          }
        },
      },
      {
        name: "name",
        type: "input",
        message: "请输入需要删除的mock文件名称：",
        when: (answers) => {
          return !answers.flag;
        },
        validate: (value) => {
          if (value === "") {
            console.log(
              chalk.red("✖"),
              chalk.red("请输入需要删除的mock文件名称：")
            );
            return false;
          }
          const fileNameUrl = `./../${mockFolder}/${value}.js`;

          try {
            const mockFileExport = require(fileNameUrl);
            if (mockFileExport) {
              return true;
            }
          } catch (err) {
            console.log(
              chalk.red("✖"),
              chalk.red(`mock文件：${value}.js 不存在`)
            );
            return false;
          }
        },
      },
    ])
    .then((answers) => {
      let fileNameUrl = "";
      if (answers.flag) {
        fileNameUrl = `${process.cwd()}\\${mockFolder}\\${replaceAll(
          "/",
          "_",
          answers.url
        )}.js`;
      } else {
        fileNameUrl = `${process.cwd()}\\${mockFolder}\\${answers.name}.js`;
      }
      fs.rmSync(fileNameUrl);
    });
});

program.parse(process.argv);

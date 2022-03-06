#!/usr/bin/env node

const { program } = require('commander');
const inquirer = require("inquirer");
const chalk = require("chalk");
const fs = require("fs");
const path = require("path");
const dayjs = require("dayjs");
const { mockFolder, language } = require("../package.json");
const replaceAll = require("./../util/replaceAll.js");
const { logSuccess, logError } = require("./../util/common.js");

const languageObject = require(`./../language/${language}.js`);

program.version("1.0.0", "-v, --version");

program
  .command("add")
  .alias("a")
  .description(languageObject.commandAdd)
  .action(() => {
    inquirer
      .prompt([
        {
          name: "url",
          type: "input",
          message: languageObject.addUrl,
          validate: (value) => {
            if (value === "") {
              console.log(logError, chalk.red(languageObject.addUrl));
              return false;
            }

            const fileName = `${replaceAll("/", "_", value)}.js`;
            const fileNameUrl = path.join("../", mockFolder, fileName);

            try {
              const mockFileExport = require(fileNameUrl);
              if (mockFileExport) {
                console.log(
                  logError,
                  chalk.red(fileNameUrl),
                  chalk.red(languageObject.addMockFileExistence)
                );
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
          message: languageObject.addName,
        },
        {
          name: "method",
          type: "list",
          message: languageObject.addMethod,
          choices: ["get", "post", "put", "delete"],
          default: "post",
        },
        {
          name: "type",
          type: "list",
          message: languageObject.addType,
          choices: ["application/json", "text/plain"],
          default: "application/json",
        },
        {
          name: "isUseMockjs",
          type: "confirm",
          message: languageObject.addIsUseMockjs,
          default: false,
        },
        {
          name: "timeout",
          type: "number",
          message: languageObject.addTimeout,
          validate: (value) => {
            if (!/^[0-9]*$/.test(value)) {
              console.log(logError, chalk.red(languageObject.addTimeoutError));
              return false;
            }
            return true;
          },
          default: 0,
        },
        // {
        //   name: "body",
        //   type: "editor",
        //   message: languageObject.addBody,
        //   postfix: "Powershell",
        //   validate: (value) => {
        //     if (!value) {
        //       console.log(logError, chalk.red(languageObject.addBody));
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

        const fileName = `${replaceAll("/", "_", answers.url)}.js`;
        const fileNameUrl = path.join(process.cwd(), mockFolder, fileName);
        fs.appendFile(
          fileNameUrl,
          `module.exports = ${JSON.stringify(fileContent, null, "\t")}`,
          (err) => {
            if (err) throw err;
            console.log(
              logSuccess,
              chalk.green(fileNameUrl),
              chalk.green(languageObject.addMockFileSuccess)
            );
          }
        );
      });
  });

program
  .command("delete")
  .alias("d")
  .description(languageObject.commandDelete)
  .action(() => {
    inquirer
      .prompt([
        {
          name: "flag",
          type: "confirm",
          message: languageObject.deleteFlag,
        },
        {
          name: "url",
          type: "input",
          message: languageObject.deleteUrl,
          when: (answers) => {
            return answers.flag;
          },
          validate: (value) => {
            if (value === "") {
              console.log(logError, chalk.red(languageObject.deleteUrl));
              return false;
            }

            const fileName = `${replaceAll("/", "_", value)}.js`;
            const fileNameUrl = path.join("./../", mockFolder, fileName);

            try {
              const mockFileExport = require(fileNameUrl);
              if (mockFileExport) {
                return true;
              }
            } catch (err) {
              console.log(
                logError,
                chalk.red(fileNameUrl),
                chalk.red(languageObject.deleteMockNonExistent)
              );
              return false;
            }
          },
        },
        {
          name: "name",
          type: "input",
          message: languageObject.deleteName,
          when: (answers) => {
            return !answers.flag;
          },
          validate: (value) => {
            if (value === "") {
              console.log(logError, chalk.red(languageObject.deleteName));
              return false;
            }
            const fileNameUrl = path.join("./..", mockFolder, `${value}.js`);

            try {
              const mockFileExport = require(fileNameUrl);
              if (mockFileExport) {
                return true;
              }
            } catch (err) {
              console.log(
                logError,
                chalk.red(fileNameUrl),
                chalk.red(languageObject.deleteMockNonExistent)
              );
              return false;
            }
          },
        },
      ])
      .then((answers) => {
        let fileNameUrl = "";
        if (answers.flag) {
          const fileName = `${replaceAll("/", "_", answers.url)}.js`;
          fileNameUrl = path.join(process.cwd(), mockFolder, fileName);
        } else {
          const fileName = `${answers.name}.js`;
          fileNameUrl = path.join(process.cwd(), mockFolder, fileName);
        }
        fs.rm(fileNameUrl, (err) => {
          if (err) throw err;
          console.log(
            logSuccess,
            chalk.green(fileNameUrl),
            chalk.green(languageObject.deleteMockSuccess)
          );
        });
      });
  });

program
  .command("language")
  .alias("lang")
  .description(languageObject.commandLanguage)
  .action(() => {
    const langPath = path.join(process.cwd(), 'language');
    let langList = fs.readdirSync(langPath);
    langList = langList.map(item => {
      return item.split(".")[0]
    })
    inquirer
      .prompt([
        {
          name: "lang",
          type: "list",
          message: languageObject.switchLanguage,
          choices: langList,
          default: language,
        }
      ])
      .then((answers) => {
        if (answers.lang !== language) {
          const packagePath = path.join(process.cwd(), 'package.json');
          const packageObject = require(packagePath);
          packageObject.language = answers.lang;
          fs.writeFile(packagePath, JSON.stringify(packageObject, null, "\t"), (err) => {
            if (err) console.log(err)
            console.log(logSuccess, chalk.green(languageObject.switchLanguageSuccess))
          })
        }
      });
  });

program
  .command("author")
  .description(languageObject.commandAuthor)
  .action(() => {
    console.log(chalk.blue('https://github.com/fxss5201'));
  });

program
  .command("github")
  .description(languageObject.commandGithub)
  .action(() => {
    console.log(chalk.blue('https://github.com/fxss5201/cmock'));
  });

program.parse(process.argv);

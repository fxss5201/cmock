const Koa = require("koa");
const path = require("path");
const fs = require("fs");
const dayjs = require("dayjs");
const { createServer } = require("http");
const { Server } = require("socket.io");
const { socketPort, mockFolder } = require("./../package.json");

module.exports = function createSocketCmock() {
  const app = new Koa();
  const httpServer = createServer(app.callback());
  const io = new Server(httpServer, {
    cors: {
      origin: "http://localhost:8890"
    }
  });

  io.on("connection", (socket) => {
    console.log(socket.id)

    socket.emit("refresh")

    socket.on("getMocks", () => {
      const dirPath = path.join(process.cwd(), mockFolder);
      const mocksFilesPath = fs.readdirSync(dirPath);
      let mocksFiles = mocksFilesPath.map(item => {
        const itemAllPath = path.join(dirPath, item)
        const itemObject = require(itemAllPath)
        return {
          ...itemObject,
          fileName: item.split('.')[0],
          filePath: item,
          method: itemObject.method ? itemObject.method.toLowerCase() : ''
        }
      })
      socket.emit("updateMocks", mocksFiles)
    })
    
    socket.on("updateMockFile", (mockFile) => {
      const isEditor = mockFile.isEditor
      delete mockFile.isEditor
      const fileNameUrl = path.join("../", mockFolder, mockFile.filePath);
      try {
        const mockFileExport = require(fileNameUrl);
        if (mockFileExport) {
          if (!isEditor) {
            socket.emit("mockFileExists", mockFile)
          } else {
            let fileContent = {
              ...mockFileExport,
              ...mockFile,
              updateTime: dayjs().format("YYYY-MM-DD HH:mm:ss"),
            };
            delete fileContent.fileName
            delete fileContent.filePath
    
            const fileNameUrl = path.join(process.cwd(), mockFolder, mockFile.filePath);
            fs.writeFile(
              fileNameUrl,
              `module.exports = ${JSON.stringify(fileContent, null, "\t")}`,
              (err) => {
                if (err) throw err;
                socket.emit("updateMockFileSuccess", mockFile)
              }
            );
          }
        }
      } catch(e) {
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

        let fileContent = {
          ...template,
          ...mockFile,
          createTime: dayjs().format("YYYY-MM-DD HH:mm:ss"),
          updateTime: dayjs().format("YYYY-MM-DD HH:mm:ss"),
        };
        delete fileContent.fileName
        delete fileContent.filePath

        const fileNameUrl = path.join(process.cwd(), mockFolder, mockFile.filePath);
        fs.writeFile(
          fileNameUrl,
          `module.exports = ${JSON.stringify(fileContent, null, "\t")}`,
          (err) => {
            if (err) throw err;
            socket.emit("addMockFileSuccess", mockFile)
          }
        );
      }
    })

    socket.on("deleteMockFile", (mockFile) => {
      const fileNameUrl = path.join(process.cwd(), mockFolder, mockFile.filePath);
      fs.rm(fileNameUrl, (err) => {
        if (err) throw err;
        socket.emit("deleteMockFileSuccess", mockFile)
      });
    })
  });

  httpServer.listen(socketPort);
}

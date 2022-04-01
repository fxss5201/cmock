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

    const dirPath = path.join(process.cwd(), mockFolder);
    const mocksFilesPath = fs.readdirSync(dirPath);
    const mocksFiles = mocksFilesPath.map(item => {
      const itemAllPath = path.join(dirPath, item)
      const itemObject = require(itemAllPath)
      return {
        fileName: item.split('.')[0],
        filePath: item,
        fileAllPath: itemAllPath,
        ...itemObject
      }
    })
    socket.emit("updateMocks", mocksFiles)
  });

  httpServer.listen(socketPort);
}

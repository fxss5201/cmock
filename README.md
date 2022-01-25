# cmock

## cmock 简介

cmock 用于根据接口自动生成 mock 文件，并根据 mock 文件起 mock 服务。

## 前言

搭建 cmock 的缘由是因为项目前后端分离之后，在联调接口前，前后端协商接口数据结构，前端即可根据数据结构来进行数据 mock ，但后端接口一变更，前端又需要维护新的 mock 数据结构，无疑会增加维护成本，所以如果能根据接口自动生成 mock 文件，一是可以降低 mock 的维护成本，二是可以快速生成以前老的接口的数据结构。

## 快速开始

```
npm install

// 创建 mock 文件
npm run create

// 起 mock 服务
npm run dev
```

## 原理分析

本项目原理如下图所示：

![cmock原理图](https://img.fxss.work/article-164303624400033-production.png)

## 生成 mock

### 生成 mock 前的配置

本项目的配置放置于 package.json 文件，主要配置项如下：

```js
{
  "port": "8888",
  "proxy": [
    {
      "url": "/api",
      "target": "http://localhost:8880"
    }
  ],
  "needParams": [
    "processCode",
    "currentPage",
    "pageSize"
  ],
  "mockFolder": "controllers",
}
```

#### port

port 用于设置服务监听的接口。

#### proxy

proxy 用于设置代理配置，和 https://cli.vuejs.org/zh/config/#devserver-proxy 配置类似，采用的是 [http-proxy-middleware](https://github.com/chimurai/http-proxy-middleware) 进行代理：

```js
"proxy": [
  {
    "url": "/api", // 设置接口匹配
    "target": "http://localhost:8880" // 需要代理到的接口地方
  }
]
```

#### needParams

needParams 需要保留的接口字段，本项目支持全局设置需要保留的接口字段，当接口参数中包含 needParams 中的参数时，会将数据保存为：

```js
body: { 接口参数: 接口数据, default: 无参数时对应的接口数据 },
```

#### mockFolder

mockFolder mock文件存放的目录，尽量不要修改。

#### 生成 mock 时的 nodemon.json

生成 mock 文件的时候需要保证配置的 watch 不包含 mock 文件存放的目录，否则生成文件的时候，一直重启服务，导致生成的 mock 文件有误。

```js
{
  "watch": ["index.js", "controller.js", "global.js", "./util/*"]
}
```

### 生成 mock 详细步骤

执行 `npm run create` ，并将前端请求执行 cmock ，如 vue 项目可在 vue.config.js 文件中配置代理：

```js
module.exports = {
  devServer: {
    proxy: {
      "/api": {
        target: "http://localhost:8888", // 指向 cmock 服务
        ws: true,
        changeOrigin: true
      }
    }
  }
}
```

然后将前端页面打开，调所有的接口，这个时候会自动生成 mock 文件。

## mock 服务

执行 `npm run dev` 起服务，会根据前端请求返回对应的 mock 文件中的数据。

### mock 服务时的 nodemon.json

mock 服务时，我们可能有时候会修改 mock 文件，但不想每次重启服务，则需要把 mock 文件配置到 nodemon.json 中的 watch 中。

```js
{
  "watch": ["index.js", "controller.js", "global.js", "./controllers/*" "./util/*"]
}
```

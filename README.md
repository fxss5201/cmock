# cmock

[English documents](https://github.com/fxss5201/cmock/blob/main/README_en.md).

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

如果需要使用可视化操作界面，需要到当前目录的 `view` 目录下执行：

```
npm install

npm run dev
```

## 命令行

在本项目下执行 `npm link` 创建 cmock 软链接。

本项目支持多语言，语言文件存放于根目录 `language` 文件夹下，配置于 `package.json` 文件的 `language` 字段，可使用命令行 `cmock language` / `cmock lang` 切换语言。

在 cmock 项目下执行 `cmock add` / `cmock a` 按照提示进行 mock 文件添加，需要注意的是 **命令行生成的 mock 文件名称是由接口地址转化的**，例如接口地址为 `/api/list` ，则 mock 文件名称为 `_api_list.js`。

>当前由于 inquirer 的 editor 传入数据结构有解析问题，所以暂时需要等mock文件创建好之后自行将数据结构复制粘贴进去（如有知道解决办法，请帮忙指出）。

在 cmock 项目下执行 `cmock delete` / `cmock d` 按照提示进行 mock 文件删除。

全部命令行：

| 命令行 | 功能 |
|----|----|
| `cmock add` / `cmock a` | 新增 mock 文件 |
| `cmock delete` / `cmock d` | 删除 mock 文件 |
| `cmock language` / `cmock lang` | 切换语言 |
| `cmock author` | 作者github信息 |
| `cmock github` | 项目github地址 |

## 原理分析

本项目原理如下图所示：

![cmock原理图](https://img.fxss.work/article-164303624400033-production.png)

## 生成 mock

### 生成 mock 前的配置

本项目的配置放置于 `package.json` 文件，主要配置项如下：

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
    "currentPage",
    "pageSize"
  ],
  "mockFolder": "mocks",
  "timeout": 0,
  "language": "zh-cn",
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

#### timeout

timeout 用于统一设置 mock 接收到请求多长时间返回数据，用于前端 loading 状态的联调。单个 mock 文件中也有个 timeout ，优先级大于统一设置的 timeout 。

#### language

language 用于设置语言，参数值为 `language` 文件夹下对应语言的文件名称，一般可使用命令行 `cmock language` / `cmock lang` 切换语言。

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
  "watch": ["index.js", "controller.js", "global.js", "./mocks/*" "./util/*"]
}
```

### mock 文件

```js
/**
 * 用于生成 mock 文件的模板
 {
    name: "$name", // 接口名称
    url: "$url", // 接口的 url
    method: "$method", // 接口方法
    type: "$type", // 接口对应的 response.type
    createTime: "$createTime", // mock 文件创建时间
    updateTime: "$updateTime", // mock 文件最后更新时间，如果手动更新 mock 文件，改时间可能不准确
    isUseMockjs: false, // 是否使用 mockjs 生成返回的数据，需要在 body 中配置 mockTemplate 
    timeout: 0, // 多久时间返回数据，用于模拟等待时间，方便前端加加载状态
    bodyKey: {}, // 内部使用，误删
    body: { // 用于存放接口数据结构
      接口参数（仅包含 package.json needParams 中配置的参数）: 接口数据结构
      mockTemplate // 用于 mock.js 生成数据
    },
  }
 */
module.exports = {
  template: `module.exports = {
    name: "$name", // 接口描述
    url: "$url",
    method: "$method",
    type: "$type",
    createTime: "$createTime",
    updateTime: "$updateTime",
    isUseMockjs: false,
    timeout: 0,
    bodyKey: {},
    body: {},
  }`,
};
```

mockTemplate 示例如下：

```js
mockTemplate: {
  "list|10": [
    {
      "id|+1": 0,
      title: "@ctitle",
      description: "@cword(100)",
      time: "@datetime('yyyy-MM-dd HH:mm:ss')",
      author: "@cname",
    },
  ],
  total: 100,
}
```

[Mock.js文档](http://mockjs.com/)

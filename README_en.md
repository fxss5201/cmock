# cmock

## Introduction to cmock

Cmock is used to automatically generate a mock file according to the interface and start a mock service according to the mock file.

## Preface

The reason for building cmock is that after the front and rear ends of the project are separated, the front and rear ends negotiate the interface data structure before the joint commissioning interface, and the front end can mock the data according to the data structure. However, once the back-end interface is changed, the front end needs to maintain a new mock data structure, which will undoubtedly increase the maintenance cost. Therefore, if the mock file can be automatically generated according to the interface, First, it can reduce the maintenance cost of mock. Second, it can quickly generate the data structure of the old interface.

## Quick start

```
npm install

// Create mock file
npm run create

// Start mock service
npm run dev
```

If you need to use the visual operation interface, you need to go to the 'view' directory of the current directory to execute:

```
npm install

npm run dev
```

## 命令行

Execute `npm link` under this project to create cmock soft link.

This project supports multiple languages. Language files are stored in the root directory `language` folder and configured in `package.json` file `language` field, you can use the command line `cmock language` / `cmock lang` to switch languages.

Execute `cmock add` / `cmock a` under the cmock project, follow the prompts to add a mock file, It should be noted that **The mock file name generated from the command line is converted by the interface address**, for example, the interface address is `/api/list` , then the mock file name is `_api_list.js`.

>At present, there is a problem in parsing the data structure passed in by the editor of the inquirer, so you need to copy and paste the data structure after the mock file is created (If you know the solution, please help point out).

Execute `cmock delete` / `cmock d` under the cmock project, follow the prompts to delete a mock file.

All command lines:

| command line | function |
|----|----|
| `cmock add` / `cmock a` | Add mock file |
| `cmock delete` / `cmock d` | Delete mock file |
| `cmock language` / `cmock lang` | Switch language |
| `cmock author` | Author GitHub information |
| `cmock github` | Project GitHub address |

## Principle analysis

The principle of the project is shown in the figure below:

![Schematic diagram of cmock](https://img.fxss.work/article-164662170300088-production.png)

## Generate mock

### Configuration before generating mock

The configuration of this project is placed in `package.json` file. The main configuration items are as follows:

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

port: Used to set the interface for service listening.

#### proxy

proxy: Used to set agent configuration, And https://cli.vuejs.org/zh/config/#devserver-proxy the proxy configuration is similar, the agent is [http-proxy-middleware](https://github.com/chimurai/http-proxy-middleware) ：

```js
"proxy": [
  {
    "url": "/api",
    "target": "http://localhost:8880"
  }
]
```

#### needParams

needParams: Interface fields to be reserved. This project supports global setting of interface fields to be reserved. When the interface parameters include the parameters in needparams, the data will be saved as:

```js
body: { Interface parameters: Interface data, default: Corresponding interface data without parameters },
```

#### mockFolder

mockFolder: The directory where mock files are stored. Try not to modify them.

#### timeout

timeout: It is used to uniformly set how long the mock receives the request to return data, and is used for the joint debugging of the front-end loading status. There is also a timeout in a single mock file, and the priority is higher than the uniformly set timeout.

#### language

language: It is used to set the language. The parameter value is the file name of the corresponding language under the `language` folder. Generally, the command line `cmock language` / `cmock lang` can be used to switch the language.

#### When generating mock, `nodemon.json`:

When generating a mock file, you need to ensure that the configured watch does not contain the directory where the mock file is stored. Otherwise, when generating a file, the service will be restarted all the time, resulting in an error in the generated mock file.

```js
{
  "watch": ["index.js", "controller.js", "global.js", "./util/*"]
}
```

### Detailed steps of generating mock

Execute `npm run create` , the front end requests to execute cmock. For example, Vue items can be displayed in `vue.config.js` file:

```js
module.exports = {
  devServer: {
    proxy: {
      "/api": {
        target: "http://localhost:8888",
        ws: true,
        changeOrigin: true
      }
    }
  }
}
```

Then open the front-end page and call all interfaces. At this time, the mock file will be automatically generated.

## Mock service

Execute `npm run dev`, return the data in the corresponding mock file according to the front-end request.

### When mocking service, `nodemon.json`:

We may modify the mock file sometimes when we use the mock service, but if we don't want to restart the service every time, we need to configure the mock file to `nodemon.json`.

```js
{
  "watch": ["index.js", "controller.js", "global.js", "./mocks/*" "./util/*"]
}
```

### Mock file

```js
/**
 * Template for generating mock files
 {
    name: "$name", // Interface name
    url: "$url", // URL of the interface
    method: "$method", // Interface method
    type: "$type", // The response corresponding to the interface type
    createTime: "$createTime", // Mock file creation time
    updateTime: "$updateTime", // The last update time of the mock file. If you manually update the mock file, the change time may be inaccurate
    isUseMockjs: false, // To generate the returned data using mockjs, you need to configure mocktemplate in the body
    timeout: 0, // How long to return data is used to simulate the waiting time to facilitate the loading state of the front end
    bodyKey: {}, // Internal use, mistakenly deleted
    body: { // Used to store interface data structure
      Interface parameters (only including the parameters configured in package.json needparams): interface data structure,
      mockTemplate // For mock JS generate data
    },
  }
 */
module.exports = {
  template: `module.exports = {
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
  }`,
};
```

mockTemplate examples are as follows:

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

[Mock.js document](https://github.com/nuysoft/Mock)

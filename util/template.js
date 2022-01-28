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
    bodyKey: {},
    body: {},
  }`,
};

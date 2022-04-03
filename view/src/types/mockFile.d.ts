export interface mockFileModel {
  fileName: string
  filePath: string
  name: string
  url: string
  method: string
  type: string
  createTime: string
  updateTime: string
  isUseMockjs: boolean
  timeout: number
  bodyKey: {},
  body: {
    [propName: string]: any
  },
}
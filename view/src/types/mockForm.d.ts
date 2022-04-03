export interface mockFormModel {
  fileName: string
  filePath: string
  name: string
  url: string
  method: string
  type: string
  isUseMockjs: boolean
  timeout: number
  bodyKey: {},
  body: {
    [propName: string]: any
  }
}

export interface mockBodyModel {
  key: string
  body: string
  disabled: boolean
}
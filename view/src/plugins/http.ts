import axios, { AxiosRequestConfig } from 'axios'

const instance = axios.create({
  baseURL: '/mock'
})

export default instance

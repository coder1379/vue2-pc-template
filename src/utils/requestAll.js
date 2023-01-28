import axios from 'axios'
import Qs from 'qs'
import { Toast } from 'vant'
// 根据环境不同引入不同api地址
import { baseApi } from '@/config'
import { getToken, gotoLogin } from './common'
// create an axios instance
const service = axios.create({
  baseURL: baseApi, // url = base api url + request url
  withCredentials: false, // send cookies when cross-domain requests 这里默认为false，生产需要可改为true 这里在测试时会由于一些设置导致接口调用失败，所有默认为false
  method: 'POST', // 默认post
  timeout: 10000 // request timeout 默认10秒超时
})

// request拦截器 request interceptor
service.interceptors.request.use(
  config => {
    // 不传递默认开启loading
    if (!config.hideloading) {
      // loading
      Toast.loading({
        forbidClick: true
      })
    }

    if (config.data) {
      config.data.token = getToken()
      // config.headers['X-Token'] = '' // 设置token参数
    }

    if (config.contentType === 'json') {
      // json格式
      config.headers['Content-Type'] = 'application/json; charset=utf-8'
    } else if (config.contentType === 'file') {
      // 包含文件兼容二进制格式
      const formData = new FormData()
      Object.keys(config.data).forEach((key) => {
        formData.append(key, config.data[key])
      })
      config.data = formData
      config.headers['Content-Type'] = 'multipart/form-data'
    } else {
      // 默认kv模式
      config.headers['Content-Type'] = 'application/x-www-form-urlencoded' // 默认格式
      config.data = Qs.stringify(config.data)
    }

    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)
// respone拦截器
service.interceptors.response.use(
  response => {
    Toast.clear()
    const res = response.data
    if (res.code && res.code !== 200) {
      // 登录超时,重新登录
      if (res.code === 401) {
        // gotoLogin(location.href)
      }
      return Promise.reject(res || 'error')
    } else {
      return Promise.resolve(res)
    }
  },
  error => {
    Toast.clear()
    console.log('err' + error) // for debug
    return Promise.reject(error)
  }
)

export default service
